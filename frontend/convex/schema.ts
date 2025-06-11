import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tasks: defineTable({
        isCompleted: v.boolean(),
        text: v.string(),
      }),
    chats: defineTable({ 
        user_id: v.string(),
        title: v.string(), 
    }),
    messages: defineTable({
        author_id: v.string(),
        chat_id: v.id("chats"),
        message: v.string(),
        type: v.string(),
        isComplete: v.boolean(),
    }),
});