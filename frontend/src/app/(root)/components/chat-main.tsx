"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Paperclip, HighlighterIcon as HighlightIcon, Code, BookOpen, Sparkles, Settings, Send } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/atoms/button"
import { Input } from "@/atoms/input"
import { ModelDropdown } from "./model-dropdown"

interface ChatMainProps {
    selectedModel: {
        name: string
        type: string
        icon: string
    }
    onModelSelectorOpen: () => void
    activeChat: number | null
    sidebarCollapsed: boolean
    onToggleSidebar: () => void
}

export function ChatMain({
    selectedModel,
    onModelSelectorOpen,
    activeChat,
    sidebarCollapsed,
    onToggleSidebar,
}: ChatMainProps) {
    const router = useRouter()
    const chatData = {
        1: {
            title: "Nextjs App Router Caching Issues",
            messages: [
                { id: 1, content: "I'm having issues with caching in Next.js App Router", isUser: true },
                {
                    id: 2,
                    content: "I can help you with Next.js App Router caching. What specific issues are you experiencing?",
                    isUser: false,
                },
                { id: 3, content: "The pages aren't updating when I make changes to my data", isUser: true },
                {
                    id: 4,
                    content: "This sounds like a cache invalidation issue. Are you using revalidateTag or revalidatePath?",
                    isUser: false,
                },
            ],
        },
        2: {
            title: "Optimistic updates not shown in UI",
            messages: [
                { id: 1, content: "My optimistic updates aren't showing in the UI", isUser: true },
                {
                    id: 2,
                    content: "Let me help you troubleshoot optimistic updates. Are you using React's useOptimistic hook?",
                    isUser: false,
                },
            ],
        },
    }

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState(
        activeChat && chatData[activeChat as keyof typeof chatData]
            ? chatData[activeChat as keyof typeof chatData].messages
            : [{ id: 1, content: "How can I help you, Jonathan?", isUser: false }],
    )

    useEffect(() => {
        if (activeChat && chatData[activeChat as keyof typeof chatData]) {
            setMessages(chatData[activeChat as keyof typeof chatData].messages)
        } else {
            setMessages([{ id: 1, content: "How can I help you, Jonathan?", isUser: false }])
        }
    }, [activeChat])

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, { id: Date.now(), content: message, isUser: true }])
            setMessage("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const navigateToSettings = () => {
        router.push("/settings")
    }

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a]">
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
                <div className="flex items-center gap-3">
                    <h2 className="text-white font-semibold text-lg">
                        {activeChat && chatData[activeChat as keyof typeof chatData]
                            ? chatData[activeChat as keyof typeof chatData].title
                            : "Chat"}
                    </h2>
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
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`mb-8 ${!msg.isUser ? "first:mt-12" : ""}`}>
                            {!msg.isUser && msg.id === 1 && (
                                <div className="text-center mb-12">
                                    <h1 className="text-4xl font-bold text-white mb-4">How can I help you, Jonathan?</h1>
                                    <p className="text-gray-400 text-lg">Choose a starting point or ask me anything</p>
                                </div>
                            )}
                            {msg.isUser ? (
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] bg-[#3a1a2f] text-white rounded-2xl rounded-br-md px-4 py-3">
                                        {msg.content}
                                    </div>
                                </div>
                            ) : (
                                msg.id !== 1 && (
                                    <div className="flex justify-start">
                                        <div className="max-w-[80%] bg-[#2a2a2a] text-white rounded-2xl rounded-bl-md px-4 py-3">
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ))}

                    {/* Action buttons shown after initial greeting */}
                    {messages.length === 1 && (
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
                    )}
                </div>
            </div>

            {/* Message input */}
            <div className="p-6 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        <Input
                            placeholder="Type your message here..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
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
                            <ModelDropdown selectedModel={selectedModel} onClick={onModelSelectorOpen} />
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
    )
}
