"use client";

import type React from "react";

import { useState } from "react";
import {
  Paperclip,
  HighlighterIcon as HighlightIcon,
  Code,
  BookOpen,
  Sparkles,
  Settings,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ModelSelector } from "./model-selector";
import { MessageRenderer } from "./MessageContent";

interface LLMMessage {
  role: string;
  content: string;
}

interface QueryMessage {
  _id: Id<"messages">;
  _creationTime: number;
  model?: string | undefined;
  type: string;
  author_id: string;
  chat_id: Id<"chats">;
  message: string;
  isComplete: boolean;
}

interface ChatMainProps {
  selectedModel: {
    id: string;
    name: string;
    icon: string;
    capabilities: string[];
  };
  setSelectedModel: (model: {
    id: string;
    name: string;
    icon: string;
    capabilities: string[];
  }) => void;
  activeChat: Id<"chats"> | null;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

interface ChatMessagesProps {
  messages: QueryMessage[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((msg) => (
          <div key={msg._id} className="mb-8">
            {msg.type === "assistant" ? (
              <div className="flex justify-start">
                <div className="max-w-[80%] bg-[#2a2a2a] text-white rounded-2xl rounded-bl-md px-4 py-3">
                  <MessageRenderer content={msg.message} />
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="max-w-[80%] bg-[#3a1a2f] text-white rounded-2xl rounded-br-md px-4 py-3">
                  {/* <MessageRenderer content={msg.message} /> */}
                  {msg.message}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatMain({
  selectedModel,
  activeChat,
  setSelectedModel,
}: ChatMainProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [message, setMessage] = useState("");

  const messages = useQuery(
    api.chat.getMessages,
    activeChat ? { conversationId: activeChat } : "skip"
  ) || [];
  const sendMessage = useMutation(api.chat.sendMessage);
  const createChat = useAction(api.chat.createChat);



  const handleSendMessage = () => {
    if (isLoading || !isAuthenticated) return;

    if (!activeChat) {
      createChat({
        message: message,
        model: selectedModel.id,
      });
    } else {
      const history: LLMMessage[] = [];
      messages.map((message) => {
        history.push({
          role: message.type,
          content: message.message,
        });
      });
      history.push({
        role: "user",
        content: message
      })

      sendMessage({
        conversationId: activeChat,
        history: history,
        model: selectedModel.id,
      });
    }

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const navigateToSettings = () => {
    router.push("/settings");
  };

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-semibold text-lg">Chat</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-xl transition-colors duration-200"
            onClick={navigateToSettings}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-xl transition-colors duration-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-current"
            >
              <path
                d="M12 3V3.01M12 21V21.01M21 12H20.99M3 12H3.01M18.364 18.364L18.354 18.354M5.636 5.636L5.646 5.646M18.364 5.636L18.354 5.646M5.636 18.364L5.646 18.354"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
      </div>

      {/* Chat messages */}
      {activeChat ? (
        <ChatMessages messages={messages} />
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-2xl mx-auto">
              <Button
                variant="outline"
                className="flex items-center justify-start gap-3 h-16 bg-[#1e1e1e] border-[#3a3a3a] hover:bg-[#2a2a2a] text-white rounded-2xl transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-[#3a1a2f] rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Create</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-3 h-16 bg-[#1e1e1e] border-[#3a3a3a] hover:bg-[#2a2a2a] text-white rounded-2xl transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-[#3a1a2f] rounded-xl flex items-center justify-center">
                  <HighlightIcon className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Explore</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-3 h-16 bg-[#1e1e1e] border-[#3a3a3a] hover:bg-[#2a2a2a] text-white rounded-2xl transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-[#3a1a2f] rounded-xl flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Code</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-start gap-3 h-16 bg-[#1e1e1e] border-[#3a3a3a] hover:bg-[#2a2a2a] text-white rounded-2xl transition-colors duration-200"
              >
                <div className="w-10 h-10 bg-[#3a1a2f] rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="font-medium">Learn</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message input */}
      <div className="p-6 border-t border-[#2a2a2a] bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pr-32 pl-6 py-6 bg-[#1e1e1e] border-[#3a3a3a] text-white rounded-2xl focus:border-[#3a1a2f] focus:ring-2 focus:ring-[#3a1a2f]/25 transition-colors duration-200 text-base"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-xl transition-colors duration-200"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <ModelSelector
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
              <Button
                size="icon"
                className="h-9 w-9 bg-[#3a1a2f] hover:bg-[#4a2a3f] rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
