"use client";

import type React from "react";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Paperclip,
  HighlighterIcon as HighlightIcon,
  Code,
  BookOpen,
  Sparkles,
  Settings,
  Send,
  Ellipsis,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { Id } from "../../../../convex/_generated/dataModel";
import { useAction, useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { ModelSelector } from "./model-selector";
import { MessageRenderer } from "./MessageRenderer";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";

interface CoreTextPart {
  type: "text";
  text: string;
}

interface CoreImagePart {
  type: "image";
  image: string; // either a URL or a base64 string
  mimeType?: string;
}

interface CoreFilePart {
  type: "file";
  data: string; // either a URL or base64 string
  mimeType: string;
}

type CoreContent = string | Array<CoreTextPart | CoreImagePart | CoreFilePart>;

interface CoreMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: CoreContent;
}


interface QueryMessage {
  _id: Id<"messages">;
  _creationTime: number;
  model?: string | undefined;
  message: {
    role: "user" | "system" | "assistant" | "tool";
    content: string | ({
      text: string;
      type: "text";
    } | {
      mimeType?: string | undefined;
      image: string;
      type: "image";
    } | {
      type: "file";
      mimeType: string;
      data: string;
    })[];
  };
  author_id: string;
  chat_id: Id<"chats">;
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
  messages: QueryMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  // Memoize the messages rendering
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      scrollToBottom();
    });
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth", // Change from "smooth" to "auto" to prevent scroll animation conflicts
      block: "end",
    });
  };
  // Memoize the messages rendering
  const renderedMessages = useMemo(
    () =>
      messages.map((msg) => (
        <div key={msg._id} className="mb-8">
          {msg.message.role === "assistant" ? (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-[#2a2a2a] text-white rounded-2xl rounded-bl-md px-4 py-3">
                {Array.isArray(msg.message.content) ? (
                  msg.message.content[0].type === "text" ? <MessageRenderer content={msg.message.content[0].text} /> : ''
                ) : (
                  <MessageRenderer content={msg.message.content} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-[#3a1a2f] text-white rounded-2xl rounded-br-md px-4 py-3">
                {Array.isArray(msg.message.content) ? (
                  <>
                    {msg.message.content[0].type === "text" ? <MessageRenderer content={msg.message.content[0].text} /> : ''}
                    <div className="flex flex-row gap-2 mt-2">
                      {msg.message.content.slice(1).map((item, index) => {
                        if (item.type === "image") {
                          return (
                            <Image
                              key={index}
                              alt="Uploaded image"
                              src={item.image || ""}
                              width={70}
                              height={50}
                              className="rounded-xl border border-[#3a3340] object-cover"
                            />
                          );
                        } else if (item.type === "file") {
                          return (
                            <div key={index} className="flex flex-row items-center w-[165px] h-[50px] overflow-hidden text-xs text-white p-3 rounded-xl border border-[#3a3340] gap-1">
                              <Paperclip className="h-4 w-4" /> {item.data?.split('/').pop()}
                            </div>
                          )
                        }
                      })}
                    </div>
                  </>
                ) : (
                  <MessageRenderer content={msg.message.content} />
                )}
              </div>
            </div>
          )}
        </div>
      )),
    [messages]
  );

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        {renderedMessages}
        <div ref={messagesEndRef} />
        {/* Add this empty div as a scroll anchor */}
      </div>
    </div>
  );
}

interface File {
  type: string,
  data: string,
  mimeType: string,
}

export function ChatMain({
  selectedModel,
  activeChat,
  setSelectedModel,
}: ChatMainProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);


  const messages =
    useQuery(
      api.chat.getMessages,
      activeChat ? { conversationId: activeChat } : "skip"
    ) || [];

  console.log("messages: ", messages);
  const sendMessage = useMutation(api.chat.sendMessage);
  const createChat = useAction(api.chat.createChat);
  const uploadImages = useMutation(api.chat.uploadImages);

  const handleSendMessage = () => {
    if (isLoading || !isAuthenticated) return;

    if (!activeChat) {
      if (uploadedFiles.length > 0) {

        const userMsg: CoreTextPart = {
          type: "text",
          text: message
        }
        const tempFiles: (CoreImagePart | CoreFilePart)[] = [];

        uploadedFiles.map(file => {
          if (file.mimeType === "application/pdf") {
            const tempFile: CoreFilePart = {
              type: "file",
              data: file.data,
              mimeType: file.mimeType,
            }
            tempFiles.push(tempFile);
          } else {
            const tempImg: CoreImagePart = {
              type: "image",
              image: file.data,
              mimeType: file.mimeType
            }
            tempFiles.push(tempImg);
          }
        })

        const content: CoreContent = [userMsg, ...tempFiles];


        const msg: CoreMessage = {
          role: "user",
          content: content
        }
        createChat({
          history: [msg],
          model: selectedModel.id
        });

      } else {
        const msg: CoreMessage = {
          role: "user",
          content: message
        }

        createChat({
          history: [msg],
          model: selectedModel.id,
        });
      }
    } else {
      if (uploadedFiles.length > 0) {

        const userMsg: CoreTextPart = {
          type: "text",
          text: message
        }
        const tempFiles: (CoreImagePart | CoreFilePart)[] = [];

        uploadedFiles.map(file => {
          if (file.mimeType === "application/pdf") {
            const tempFile: CoreFilePart = {
              type: "file",
              data: file.data,
              mimeType: file.mimeType,
            }
            tempFiles.push(tempFile);
          } else {
            const tempImg: CoreImagePart = {
              type: "image",
              image: file.data,
              mimeType: file.mimeType
            }
            tempFiles.push(tempImg);
          }
        })

        const content: CoreContent = [userMsg, ...tempFiles];


        const msg: CoreMessage = {
          role: "user",
          content: content
        }

        const oldHistory: CoreMessage[] = [];

        messages.map(m => {
          if (m.message) {
            oldHistory.push({
              role: m.message.role,
              content: m.message.content
            });
          }
        })

        const newHistory: CoreMessage[] = [...oldHistory, msg];

        sendMessage({
          conversationId: activeChat,
          history: newHistory,
          model: selectedModel.id,
        });

      } else {
        const msg: CoreMessage = {
          role: "user",
          content: message
        }

        const oldHistory: CoreMessage[] = [];

        messages.map(m => {
          if (m.message) {
            oldHistory.push({
              role: m.message.role,
              content: m.message.content
            });
          }
        })

        const newHistory: CoreMessage[] = [...oldHistory, msg];

        // createChat({
        //   history: [msg],
        //   model: selectedModel.id,
        // });

        sendMessage({
          conversationId: activeChat,
          history: newHistory,
          model: selectedModel.id,
        });

      }
    }

    setMessage("");
    setUploadedFiles([]);
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
        <div className="flex flex-col  gap-3 max-w-4xl mx-auto">
          <div className="flex flex-row w-full gap-4">
            {uploadedFiles.map((file, index) => {
              if (file.type === "application/pdf") {
                return (
                  <div key={index} className="flex flex-row items-center w-[165px] h-[50px] overflow-hidden text-xs text-white p-3 rounded-xl border-1 border-[#3a3340] gap-1">
                    <Paperclip className="h-4 w-4" /> {file.type}
                  </div>
                )
              } else {
                return (
                  <Image
                    key={index}
                    alt={file.mimeType}
                    src={file.data}
                    width={70}  // 70 pixels
                    height={50} // 50 pixels
                    className="rounded-xl border-1 border-[#3a3340]"
                  />
                );
              }

            })}
          </div>
          <div className="relative bg-teal-300">
            <Input
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pr-32 pl-6 py-6 bg-[#1e1e1e] border-[#3a3a3a] text-white rounded-2xl focus:border-[#3a1a2f] focus:ring-2 focus:ring-[#3a1a2f]/25 transition-colors duration-200 text-base"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {(selectedModel.capabilities.includes('image') || selectedModel.capabilities.includes('pdf')) && (
                <UploadButton
                  endpoint="imageUploader"
                  className="ut-button:h-9 ut-button:w-9 ut-button:bg-transparent ut-allowed-content:hidden"
                  content={{
                    button({ ready }) {
                      if (ready) return <Paperclip className="w-4 h-4 text-[#99a1af]" />;

                      return <Ellipsis className="w-4 h-4 text-[#99a1af]" />;
                    },
                    allowedContent({ ready, isUploading }) {
                      if (!ready) return <Ellipsis className="w-4 h-4 text-[#99a1af]" />;
                      if (isUploading) return <LoaderCircle className="w-4 h-4 text-[#99a1af]" />;
                      return "";
                    },
                  }}
                  onClientUploadComplete={async (res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    const filesFormatted: { name: string, url: string, size: number, mimeType: string }[] = [];

                    res.map(file => {
                      filesFormatted.push({
                        name: file.name,
                        url: file.ufsUrl,
                        size: file.size,
                        mimeType: file.type,
                      })
                    });

                    const tempFiles = await uploadImages({ files: filesFormatted });
                    setUploadedFiles(prevFiles => [...prevFiles, ...tempFiles]);
                    // alert("Upload Completed");
                  }}
                  onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                  }}
                />
              )}
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
