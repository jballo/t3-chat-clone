import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


const coreTextPart = v.object({
    type: v.literal("text"),
    text: v.string(),
  });
  
  const coreImagePart = v.object({
    type: v.literal("image"),
    image: v.string(), // url
    mimeType: v.optional(v.string()),
  });
  
  const coreFilePart = v.object({
    type: v.literal("file"),
    data: v.string(), // url
    mimeType: v.string(),
  })
  
  const coreContent = v.union(
    v.string(),
    v.array(v.union(coreTextPart, coreImagePart, coreFilePart))
  )
  
  const coreMessage = v.object({
    role: v.union(
      v.literal("system"),
      v.literal("user"),
      v.literal("assistant"),
      v.literal("tool")
    ),
    content: coreContent
  });

export default defineSchema({
    tasks: defineTable({
        isCompleted: v.boolean(),
        text: v.string(),
      }),
    chats: defineTable({ 
        user_id: v.string(),
        title: v.string(), 
    }),
    files: defineTable({
        name: v.string(),
        url: v.string(),
        mimeType: v.string(),
        size: v.number(),
        authorId: v.string(),
    }),
    messages: defineTable({
        author_id: v.string(),
        chat_id: v.id("chats"),
        message: coreMessage,
        isComplete: v.boolean(),
        model: v.optional(v.string()),
    }),
    invites: defineTable({
        recipient_email: v.string(),
        author_email: v.string(),
        chat_id: v.id("chats"),
        chat_name: v.string(),
        accepted: v.string(),
    })
});