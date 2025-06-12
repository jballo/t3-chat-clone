import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { generateText, streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { api, internal } from "./_generated/api";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const createChat = action({
  args: {
    message: v.string(),
    model: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const user_id = identity.subject;
    const userMessage = args.message;
    const model = args.model;

    const google = createGoogleGenerativeAI({
      baseURL: "https://generativelanguage.googleapis.com/v1beta",
      apiKey: process.env.GEMINI_KEY,
    });

    const messages: Message[] = [
      {
        role: "system",
        content:
          "Generate a four word title that describes the message the user will provider. NO LONGER THAN FOUR WORDS",
      },
      { role: "user", content: userMessage },
    ];

    const { text } = await generateText({
      model: google("gemini-2.0-flash-lite"),
      messages: messages,
    });

    console.log("Title: ", text);

    await ctx.runMutation(api.chat.saveChat, {
      userId: user_id,
      title: text,
      userMessage: userMessage,
      model: model,
    });
  },
});

export const saveChat = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    userMessage: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const user_id = args.userId;
    const generatedTitle = args.title;
    const userMessage = args.userMessage;
    const model = args.model;

    const chat_id = await ctx.db.insert("chats", {
      user_id: user_id,
      title: generatedTitle,
    });
    console.log("chat_id: ", chat_id);

    // create the message for the new chat

    await ctx.runMutation(api.chat.sendMessage, {
      conversationId: chat_id,
      history: [
        {
          role: "user",
          content: userMessage,
        },
      ],
      model: model,
    });
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("chats"),
    history: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    // save user message
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const user_id = identity.subject;
    const history = args.history;
    const msg = history[history.length - 1];
    const model = args.model;
    const conversation_id = args.conversationId;
    console.log("Message: ", msg);

    await ctx.db.insert("messages", {
      author_id: user_id,
      chat_id: conversation_id,
      message: msg.content,
      type: "user",
      isComplete: true,
      model: model,
    });

    const message_id = await ctx.db.insert("messages", {
      author_id: user_id,
      chat_id: conversation_id,
      message: "",
      type: "assistant",
      isComplete: false,
    });

    await ctx.scheduler.runAfter(0, internal.chat.stream, {
      messageId: message_id,
      history: history,
      model: model,
    });
  },
});

export const stream = internalAction({
  args: {
    messageId: v.id("messages"),
    history: v.array(
      v.object({
        role: v.string(),
        content: v.string(),
      })
    ),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const message_id = args.messageId;
    const history: Message[] = args.history as Message[];
    const model = args.model;

    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_KEY,
    });

    // get llm response w/ streaming

    const { textStream } = streamText({
      model: groq(model), // llama-3.1-8b-instant
      system: "You are a professional assistant ready to help",
      messages: history,
    });

    let content = "";

    // while reciving chunks add it to a string
    for await (const textPart of textStream) {
      content += textPart;
      // console.log("Current Content: ", content);
      // update the appropriate message id with the new current message
      await ctx.runMutation(internal.chat.updateMessage, {
        messageId: message_id,
        content: content,
      });
    }

    // mark the appropriate message as complete
    await ctx.runMutation(internal.chat.completeMessage, {
      messageId: message_id,
    });
  },
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
  },
});

export const completeMessage = internalMutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    // update appropriate message with the completed status
    const messageId = args.messageId;

    await ctx.db.patch(messageId, { isComplete: true });
  },
});

export const getChats = query({
  args: {},
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
      .collect();

    console.log("Chats: ", chats);

    return chats;
  },
});

export const getMessages = query({
  args: { conversationId: v.id("chats") },
  handler: async (ctx, args) => {
    // return all the messages for the appropirate conversation
    const conversation_id = args.conversationId;

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chat_id"), conversation_id))
      .collect();

    return messages;
  },
});



export const deleteChat = mutation({
  args: { conversationId: v.id("chats") },
  handler: async (ctx, args) => {
    const conversation_id = args.conversationId;

    // query messages for chat

    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("chat_id"), conversation_id))
      .collect();

    // delete chat messsages for appropriate chat
    for (const msg of messages) {
      await ctx.db.delete(msg._id);
    }

    // delete chat
    await ctx.db.delete(conversation_id);
  }
})