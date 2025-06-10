"use client"

import { useState } from "react"
import { Search, Settings, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/atoms/button"
import { Input } from "@/atoms/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar"
import { Authenticated, Unauthenticated, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface ChatSidebarProps {
    collapsed: boolean
    onToggleCollapse: () => void
    activeChat: Id<"chats"> | null
    onChatSelect: (chatId: Id<"chats"> | null) => void
}

export function ChatList({ collapsed, activeChat, onChatSelect }: { collapsed: boolean; activeChat: Id<"chats"> | null; onChatSelect: (chatId: Id<"chats"> | null) => void }) {
    const [searchQuery, setSearchQuery] = useState("");

    const conversations = useQuery(api.chat.getChats) || [];


    // // Filter conversations based on search query
    // const filteredConversations = useMemo(() => {
    //     if (!searchQuery.trim()) return conversations

    //     return conversations?.filter(
    //         (conversation) =>
    //             conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //             conversation.preview.toLowerCase().includes(searchQuery.toLowerCase()),
    //     );
    // }, [searchQuery])

    // // Group filtered conversations by date
    // const groupedConversations = useMemo(() => {
    //     return filteredConversations?.reduce(
    //         (acc, conversation) => {
    //             if (!acc[conversation.date]) {
    //                 acc[conversation.date] = []
    //             }
    //             acc[conversation.date].push(conversation)
    //             return acc
    //         },
    //         {} as Record<string, typeof conversations>,
    //     )
    // }, [filteredConversations])


    return (
        <>
            {!collapsed && (
                <>
                    <div className="px-4 pt-4 pb-2">
                        <Button className="w-full bg-[#3a1a2f] hover:bg-[#4a2a3f] text-white rounded-xl h-11 font-medium transition-colors duration-200"
                            onClick={() => onChatSelect(null)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            New Chat
                        </Button>
                    </div>

                    <div className="px-4 pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search your threads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#1e1e1e] border-[#2a2a2a] text-gray-300 h-10 rounded-xl focus:border-[#3a1a2f] focus:ring-1 focus:ring-[#3a1a2f] transition-colors duration-200"
                            />
                        </div>
                    </div>
                </>
            )}

            <div className="flex-1 overflow-y-auto">
                {!collapsed ? (
                    conversations.map((conversation) => (
                        <div
                            key={conversation._id}
                            onClick={() => onChatSelect(conversation._id)}
                            className={`mx-2 mb-1 px-3 py-3 rounded-xl cursor-pointer text-gray-300 text-sm transition-colors duration-150 hover:bg-[#2a2a2a] relative ${activeChat === conversation._id ? "bg-[#2a1a2f]" : ""
                                }`}
                        >
                            {activeChat === conversation._id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b5cf6] rounded-r-full" />
                            )}
                            <div className="flex flex-col">
                                <div className="font-medium text-white mb-1 line-clamp-1">{conversation._id}</div>
                                <div className="text-xs text-gray-400 line-clamp-1 mb-1">{conversation._id}</div>
                                <div className="text-xs text-gray-500">{conversation._creationTime}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center gap-2 p-2">
                        {conversations.slice(0, 8).map((conversation) => (
                            <button
                                key={conversation._id}
                                onClick={() => onChatSelect(conversation._id)}
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-colors duration-150 ${activeChat === conversation._id
                                    ? "bg-[#3a1a2f] text-white"
                                    : "bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                                    }`}
                                title={conversation._id.toString()}
                            >
                                {conversation._id.toString().slice(0, 2).toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
            </div >
        </>
    );
}

export function ChatSidebar({ collapsed, onToggleCollapse, activeChat, onChatSelect }: ChatSidebarProps) {
    const router = useRouter()

    // const conversations = [
    //     {
    //         id: 1,
    //         title: "Nextjs App Router Caching Issues",
    //         date: "Today",
    //         preview: "Im having issues with caching in Next.js App Router",
    //         timestamp: "2m ago",
    //     },
    //     {
    //         id: 2,
    //         title: "Optimistic updates not shown in UI",
    //         date: "Last 7 Days",
    //         preview: "My optimistic updates arent showing in the UI",
    //         timestamp: "1h ago",
    //     },
    //     {
    //         id: 3,
    //         title: "Nextjs App Router Like Button",
    //         date: "Last 7 Days",
    //         preview: "How to implement a like button with optimistic updates",
    //         timestamp: "3h ago",
    //     },
    //     {
    //         id: 4,
    //         title: "Responsive Image Sizing in Next",
    //         date: "Last 7 Days",
    //         preview: "Best practices for responsive images",
    //         timestamp: "1d ago",
    //     },
    //     {
    //         id: 5,
    //         title: "Optimistic UI Updates for Social",
    //         date: "Last 7 Days",
    //         preview: "Building social features with optimistic updates",
    //         timestamp: "2d ago",
    //     },
    //     {
    //         id: 6,
    //         title: "Nextjs App Router SVG Folder",
    //         date: "Last 7 Days",
    //         preview: "Organizing SVG assets in Next.js",
    //         timestamp: "3d ago",
    //     },
    //     {
    //         id: 7,
    //         title: "Nextjs Edge Runtime Explanation",
    //         date: "Last 7 Days",
    //         preview: "Understanding Edge Runtime in Next.js",
    //         timestamp: "4d ago",
    //     },
    // ]


    const navigateToSettings = () => {
        router.push("/settings")
    }

    return (
        <div
            className={`${collapsed ? "w-16" : "w-80"} h-full flex flex-col bg-[#121212] border-r border-[#2a2a2a] transition-all duration-300 ease-in-out`}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
                <div className={`flex items-center ${collapsed ? "justify-center" : ""}`}>
                    <button
                        onClick={onToggleCollapse}
                        className="w-8 h-8 mr-3 hover:bg-[#2a2a2a] rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 text-gray-400 hover:text-white transition-colors"
                        >
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    {!collapsed && (
                        <div className="flex items-center">
                            <h1 className="text-white text-xl font-bold">T3.chat</h1>
                        </div>
                    )}
                </div>
            </div>
            <>
                <>
                    <Authenticated>
                        <ChatList collapsed={collapsed} activeChat={activeChat} onChatSelect={onChatSelect} />
                    </Authenticated>
                    <Unauthenticated>
                        Sign In To View/Create Chats
                    </Unauthenticated>
                </>
                {!collapsed ? (
                    <div className="p-4 border-t border-[#2a2a2a]">
                        <div
                            className="flex items-center cursor-pointer hover:bg-[#2a2a2a] rounded-xl p-2 transition-colors duration-200"
                            onClick={navigateToSettings}
                        >
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src="/images/avatar.png" />
                                <AvatarFallback className="bg-[#3a1a2f] text-white font-bold">JB</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex flex-col">
                                <span className="text-sm font-medium text-white">Jonathan Ballona Sanchez</span>
                                <div className="flex items-center">
                                    <span className="text-xs text-[#8b5cf6] font-medium">Pro</span>
                                    <div className="w-1 h-1 bg-green-500 rounded-full ml-2" />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors duration-200"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="p-2 border-t border-[#2a2a2a] flex justify-center">
                        <Avatar className="h-12 w-12 cursor-pointer transition-colors duration-200" onClick={navigateToSettings}>
                            <AvatarImage src="/images/avatar.png" />
                            <AvatarFallback className="bg-[#3a1a2f] text-white font-bold">JB</AvatarFallback>
                        </Avatar>
                    </div>
                )}
            </>
        </div>
    )
}
