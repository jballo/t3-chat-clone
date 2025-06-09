"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ModelSelector } from "./model-selector"
import { ChatMain } from "./chat-main"

export function ChatInterface() {
    const [showModelSelector, setShowModelSelector] = useState(false)
    const [selectedModel, setSelectedModel] = useState({
        name: "Claude 4 Sonnet",
        type: "Reasoning",
        icon: "AI",
    })

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [activeChat, setActiveChat] = useState<number | null>(null)

    return (
        <>
            <ChatSidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                activeChat={activeChat}
                onChatSelect={setActiveChat}
            />
            <div className="flex-1 flex flex-col">
                {showModelSelector ? (
                    <ModelSelector
                        onSelect={(model) => {
                            setSelectedModel(model)
                            setShowModelSelector(false)
                        }}
                        onClose={() => setShowModelSelector(false)}
                    />
                ) : (
                    <ChatMain
                        selectedModel={selectedModel}
                        onModelSelectorOpen={() => setShowModelSelector(true)}
                        activeChat={activeChat}
                        sidebarCollapsed={sidebarCollapsed}
                        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                )}
            </div>
        </>
    )
}
