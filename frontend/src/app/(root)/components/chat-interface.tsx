"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ModelSelector } from "./model-selector"
import { ChatMain } from "./chat-main"
import { Id } from "../../../../convex/_generated/dataModel"

interface Model {
    name: string;
    type: string;
    icon: string;
}

// Interface for the model coming from ModelSelector
interface ModelSelectorModel {
    id: string;
    name: string;
    icon: string;
    capabilities: string[];
    color: string;
    isPro?: boolean;
    isDegraded?: boolean;
    subName?: string;
}

export function ChatInterface() {
    const [showModelSelector, setShowModelSelector] = useState(false)
    const [selectedModel, setSelectedModel] = useState<Model>({
        name: "Claude 4 Sonnet",
        type: "Reasoning",
        icon: "AI",
    })

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [activeChat, setActiveChat] = useState<Id<"chats"> | null>(null)

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
                        onSelect={(model: ModelSelectorModel) => {
                            setSelectedModel({
                                name: model.name,
                                type: "Reasoning", // You might want to derive this from model.capabilities
                                icon: model.icon,
                            })
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
