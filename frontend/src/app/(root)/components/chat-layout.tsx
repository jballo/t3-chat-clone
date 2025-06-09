"use client"

import { useState } from "react"
import { ChatArea } from "./chat-area"
import { Menu } from "lucide-react"
import { Button } from "@/atoms/button"
import { ChatSidebar } from "./chat-sidebar"

export function ChatLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeChat, setActiveChat] = useState(1);

    return (
        <div className="flex h-full">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
            >
                <ChatSidebar collapsed={sidebarOpen} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} activeChat={activeChat} onChatSelect={(chatId) => setActiveChat(chatId)} />
            </div>

            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="font-semibold">T3 Chat</h1>
                    <div className="w-10" />
                </div>

                <ChatArea />
            </div>
        </div>
    )
}
