import { v } from "convex/values";
import { internalAction, internalMutation, mutation, query } from "./_generated/server";

export const createChat = mutation({
    args: {},
    async handler(ctx) {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
        throw new Error("Not authenticated");
        }

        const user_id = identity.subject;
        console.log("user: ", user_id);

        const chat_id = await ctx.db.insert("chats", {  user_id: user_id});
        console.log("chat_id: ", chat_id);

        // // populate with at least one message
        // const message_id = await ctx.db.insert("messages", {chat_id: chat_id, author_id: user_id, message: "How may I assist you?", type: "assistant"});
        // console.log("message_id: ", message_id);
        
    },
})

export const sendMessage = mutation({
    args: {
        conversationId: v.string(),
        userMessage: v.string(),
    },
    handler: async (ctx, args) => {
        // save usefr message

        //  create empty assistant message

        // start streaming
    }
})

export const stream = internalAction({
    args: {
        messageId: v.id("messages"),
        userMessage: v.string(),
    },
    handler: async (ctx, args) => {
        // get llm response w/ streaming

        // while reciving chunks add it to a string
        // update the appropriate message id with the new current message


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
            .collect()

        console.log("Chats: ", chats);

        return chats
    }
})


export const getMessages = query({
    args: {conversationId: v.string()},
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


