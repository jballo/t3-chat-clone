import { v } from "convex/values";
import { action, internalAction, internalMutation, mutation, query } from "./_generated/server";
import { generateText, streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';import { api, internal } from "./_generated/api";

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }


export const createChat = action({
    args: {
        message: v.string()
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
        throw new Error("Not authenticated");
        }

        const user_id = identity.subject;
        const userMessage = args.message;


        const google = createGoogleGenerativeAI({
            baseURL: "https://generativelanguage.googleapis.com/v1beta",
            apiKey: process.env.GEMINI_KEY
        });

        const messages: Message[] = [
            { role: "system", content: "Generate a four word title that describes the message the user will provider. NO LONGER THAN FOUR WORDS"},
            { role: "user", content: userMessage }

        ]

        const { text } = await generateText({
            model: google('gemini-2.0-flash-lite'),
            messages: messages
        })

        console.log("Title: ", text);

        await ctx.runMutation(api.chat.saveChat, {
            userId: user_id,
            title: text,
            userMessage: userMessage,
        })
        
    },
})

export const saveChat = mutation({
    args: {
        userId: v.string(),
        title: v.string(),
        userMessage: v.string(),
    },
    handler: async (ctx, args) => {
        const user_id = args.userId;
        const generatedTitle = args.title;
        const userMessage = args.userMessage;

        const chat_id = await ctx.db.insert("chats", {
            user_id: user_id,
            title: generatedTitle
        });
        console.log("chat_id: ", chat_id);

        // create the message for the new chat

        await ctx.runMutation(api.chat.sendMessage, {
            conversationId: chat_id,
            userMessage: userMessage
        });
    }
})



export const sendMessage = mutation({
    args: {
        conversationId: v.id("chats"),
        userMessage: v.string(),
    },
    handler: async (ctx, args) => {
        // save user message        
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
        throw new Error("Not authenticated");
        }
        const user_id = identity.subject;
        const msg = args.userMessage;
        const conversation_id = args.conversationId;
        console.log("Message: ", msg);

        await ctx.db.insert("messages", {
            author_id: user_id,
            chat_id: conversation_id,
            message: msg,
            type: "user",
            isComplete: true
        });

        const message_id = await ctx.db.insert("messages", {
            author_id: user_id,
            chat_id: conversation_id,
            message: "",
            type: "assistant",
            isComplete: false
        })

        await ctx.scheduler.runAfter(0, internal.chat.stream, {
            messageId: message_id,
            userMessage: msg,
        });

        // await ctx.scheduler.runAfter(0, internal.chat.singleResponse, {
        //     conversationId: conversation_id,
        //     userMessage: msg,
        //     userId: user_id
        // });

        // start streaming
    }
})

export const singleResponse = internalAction({
    args: {
        userId: v.string(),
        conversationId: v.id("chats"),
        userMessage: v.string(),
    },
    handler: async (ctx, args) => {
        const user_id = args.userId;
        const msg = args.userMessage;
        const conversation_id = args.conversationId;

        const groq = createGroq({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: process.env.GROQ_KEY
        });

        const { text } = await generateText({
            model: groq('llama-3.1-8b-instant'),
            system: 'You are a friendly assistant!',
            prompt: msg
        });

        console.log("Text: ", text);

        // call a mutation to save the response
        await ctx.runMutation(internal.chat.saveAssistantMessage, {
            authorId: user_id,
            chatId: conversation_id,
            message: text
        })
    }
})

export const saveAssistantMessage = internalMutation({
    args: {
        authorId: v.string(),
        chatId: v.id("chats"),
        message: v.string()
    },
    handler: async(ctx, args) => {
        return await ctx.db.insert("messages", {
            author_id: args.authorId,
            chat_id: args.chatId,
            message: args.message,
            type: "assistant",
            isComplete: true
        });
    }
})

export const stream = internalAction({
    args: {
        messageId: v.id("messages"),
        userMessage: v.string(),
    },
    handler: async (ctx, args) => {

        const message_id = args.messageId;
        const msg = args.userMessage;

        const groq = createGroq({
            baseURL: 'https://api.groq.com/openai/v1',
            apiKey: process.env.GROQ_KEY
        });

        // get llm response w/ streaming
        
        const { textStream } = streamText({
            model: groq('llama-3.1-8b-instant'),
            prompt: msg
        });

        let content = "";

        // while reciving chunks add it to a string
        for await (const textPart of textStream){
            content += textPart;
            // console.log("Current Content: ", content);
            // update the appropriate message id with the new current message
            await ctx.runMutation(internal.chat.updateMessage, {
                messageId: message_id,
                content: content
            });
        }
        
        // mark the appropriate message as complete
    }
});

export const updateMessage = internalMutation({
    args: {
        messageId: v.id("messages"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        // update appropriate message with the new content
        const messageId = args.messageId;
        const content = args.content;

        await ctx.db.patch(messageId, { message: content });
    }
});

export const completeMessage = internalMutation({
    args: { messageId: v.id("messages")},
    handler: async (ctx, args) => {
        // update appropriate message with the completed status
    }
});


export const getChats = query({
    args:{},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
        throw new Error("Not authenticated");
        }

        const user_id = identity.subject;
        
        const chats = await ctx.db
            .query("chats")
            .filter((q) => q.eq(q.field("user_id"), user_id))
            .order("desc")
            .collect()

        console.log("Chats: ", chats);

        return chats
    }
})


export const getMessages = query({
    args: {conversationId: v.id("chats")},
    handler: async (ctx, args) => {
        // return all the messages for the appropirate conversation
        const conversation_id = args.conversationId;

        const messages = await ctx.db
            .query("messages")
            .filter((q) => q.eq(q.field("chat_id"), conversation_id))
            .collect();
         
        return messages;
    }
});


