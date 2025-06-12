"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, Filter, Eye, Globe, FileText, Wand2, ChevronDown } from "lucide-react"
import { Input } from "@/atoms/input"
import { Button } from "@/atoms/button"

interface Model {
    id: string
    name: string
    icon: string
    capabilities: string[]
    color: string
    isPro?: boolean
    isDegraded?: boolean
    subName?: string
}

interface ModelSelectorProps {
    onSelect: (model: Model) => void
    onClose: () => void
}

export function ModelSelector({ onSelect, onClose }: ModelSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<"list" | "grid">("list")

    const allModels = [
        {
            id: "gemini-flash",
            name: "Gemini 2.5 Flash",
            icon: "gemini",
            capabilities: ["vision", "web", "text"],
            color: "text-purple-400",
        },
        {
            id: "gemini-pro",
            name: "Gemini 2.5 Pro",
            icon: "gemini",
            capabilities: ["vision", "web", "text", "reasoning"],
            isPro: true,
            color: "text-purple-400",
        },
        {
            id: "gpt-imagegen",
            name: "GPT ImageGen",
            icon: "gpt",
            capabilities: ["vision"],
            color: "text-pink-400",
        },
        {
            id: "o4-mini",
            name: "o4-mini",
            icon: "o4",
            capabilities: ["vision", "reasoning"],
            color: "text-pink-400",
        },
        {
            id: "claude-sonnet",
            name: "Claude 4 Sonnet",
            icon: "claude",
            capabilities: ["vision", "text"],
            isDegraded: true,
            color: "text-orange-400",
        },
        {
            id: "claude-reasoning",
            name: "Claude 4 Sonnet",
            subName: "(Reasoning)",
            icon: "claude",
            capabilities: ["vision", "text", "reasoning"],
            isDegraded: true,
            color: "text-orange-400",
        },
        {
            id: "deepseek",
            name: "DeepSeek R1",
            subName: "(Llama Distilled)",
            icon: "deepseek",
            capabilities: ["reasoning"],
            color: "text-purple-400",
        },
        // Additional models for grid view
        {
            id: "gemini-2-flash",
            name: "Gemini 2.0 Flash",
            icon: "gemini",
            capabilities: ["vision", "web", "text"],
            color: "text-purple-400",
        },
        {
            id: "gemini-2-flash-lite",
            name: "Gemini 2.0 Flash Lite",
            icon: "gemini",
            capabilities: ["vision", "text"],
            isPro: true,
            color: "text-purple-400",
        },
        {
            id: "gpt-4o-mini",
            name: "GPT 4o-mini",
            icon: "gpt",
            capabilities: ["vision"],
            color: "text-pink-400",
        },
        {
            id: "gpt-4o",
            name: "GPT 4o",
            icon: "gpt",
            capabilities: ["vision"],
            color: "text-pink-400",
        },
    ]

    const filteredModels = useMemo(() => {
        if (!searchQuery.trim()) return allModels
        return allModels.filter(
            (model) =>
                model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (model.subName && model.subName.toLowerCase().includes(searchQuery.toLowerCase())),
        )
    }, [searchQuery])

    const getModelIcon = (iconType: string, color: string) => {
        switch (iconType) {
            case "gemini":
                return <div className={`${color} text-lg flex items-center justify-center`}>✧</div>
            case "claude":
                return <div className={`${color} text-sm font-bold flex items-center justify-center`}>AI</div>
            case "gpt":
            case "o4":
                return (
                    <div className={`${color} flex items-center justify-center`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                )
            case "deepseek":
                return (
                    <div className={`${color} flex items-center justify-center`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                    </div>
                )
            default:
                return null
        }
    }

    const renderListView = () => (
        <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-4">
                {filteredModels.slice(0, 7).map((model) => (
                    <div
                        key={model.id}
                        className="flex items-center justify-between p-3 hover:bg-[#2a2a2a]/50 rounded-lg cursor-pointer transition-colors duration-200 group"
                        onClick={() => onSelect(model)}
                    >
                        <div className="flex items-center gap-3">
                            {getModelIcon(model.icon, model.color)}
                            <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium">{model.name}</span>
                                    {model.subName && <span className="text-gray-400 text-sm">{model.subName}</span>}
                                    {model.isPro && (
                                        <div className="bg-[#2a1a2f] rounded-full p-1">
                                            <Wand2 className="h-3 w-3 text-purple-400" />
                                        </div>
                                    )}
                                    {model.isDegraded && (
                                        <span className="text-xs px-2 py-0.5 bg-amber-900/30 text-amber-500 rounded-md">Degraded</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {model.capabilities.includes("vision") && <Eye className="h-4 w-4 text-gray-400" />}
                            {model.capabilities.includes("web") && <Globe className="h-4 w-4 text-gray-400" />}
                            {model.capabilities.includes("text") && <FileText className="h-4 w-4 text-gray-400" />}
                            {model.capabilities.includes("reasoning") && <Wand2 className="h-4 w-4 text-gray-400" />}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderGridView = () => (
        <div className="flex-1 overflow-y-auto p-4">
            {/* Favorites section */}
            <div className="mb-8">
                <h2 className="text-purple-400 text-sm font-medium mb-3 flex items-center">
                    <span className="mr-1">★</span> Favorites
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {filteredModels.slice(0, 7).map((model) => (
                        <div
                            key={model.id}
                            className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-3 cursor-pointer hover:border-[#3a3a3a] transition-colors"
                            onClick={() => onSelect(model)}
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-2">
                                    {getModelIcon(model.icon, model.color)}
                                    {model.isPro && (
                                        <div className="bg-[#2a1a2f] rounded-full p-1">
                                            <Wand2 className="h-3 w-3 text-purple-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <h3 className="text-white text-sm font-medium">{model.name}</h3>
                                            {model.isDegraded && (
                                                <span className="text-xs px-1.5 py-0.5 bg-amber-900/30 text-amber-500 rounded">Degraded</span>
                                            )}
                                        </div>
                                        {model.subName && <p className="text-gray-400 text-xs">{model.subName}</p>}
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        {model.capabilities.includes("vision") && <Eye className="h-4 w-4 text-gray-400" />}
                                        {model.capabilities.includes("web") && <Globe className="h-4 w-4 text-gray-400" />}
                                        {model.capabilities.includes("text") && <FileText className="h-4 w-4 text-gray-400" />}
                                        {model.capabilities.includes("reasoning") && <Wand2 className="h-4 w-4 text-gray-400" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Others section */}
            <div>
                <h2 className="text-gray-400 text-sm font-medium mb-3">Others</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {filteredModels.slice(7).map((model) => (
                        <div
                            key={model.id}
                            className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-3 cursor-pointer hover:border-[#3a3a3a] transition-colors"
                            onClick={() => onSelect(model)}
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center justify-between mb-2">
                                    {getModelIcon(model.icon, model.color)}
                                    {model.isPro && (
                                        <div className="bg-[#2a1a2f] rounded-full p-1">
                                            <Wand2 className="h-3 w-3 text-purple-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-auto">
                                    <div className="flex flex-col">
                                        <h3 className="text-white text-sm font-medium">{model.name}</h3>
                                        {model.subName && <p className="text-gray-400 text-xs">{model.subName}</p>}
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        {model.capabilities.includes("vision") && <Eye className="h-4 w-4 text-gray-400" />}
                                        {model.capabilities.includes("web") && <Globe className="h-4 w-4 text-gray-400" />}
                                        {model.capabilities.includes("text") && <FileText className="h-4 w-4 text-gray-400" />}
                                        {model.capabilities.includes("reasoning") && <Wand2 className="h-4 w-4 text-gray-400" />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col h-full bg-[#1a1a1a] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[#2a2a2a]">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Search models..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#232323] border-[#333333] text-white h-10"
                    />
                </div>
            </div>

            {/* Content */}
            {viewMode === "list" ? renderListView() : renderGridView()}

            {/* Footer */}
            <div className="p-4 border-t border-[#2a2a2a] flex items-center justify-between">
                <Button variant="ghost" className="text-gray-300 flex items-center gap-1" onClick={onClose}>
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                </Button>

                <Button
                    variant="ghost"
                    className="text-gray-300 flex items-center gap-1"
                    onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                >
                    {viewMode === "list" ? (
                        <>
                            <span>Show all</span>
                            <Filter className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            <span>List view</span>
                            <ChevronDown className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>

            {/* Bottom model selector bar */}
            <div className="p-4 border-t border-[#2a2a2a] bg-[#1a1a1a]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#8b5cf6] rounded-full" />
                        <span className="text-white font-medium">Claude 4 Sonnet</span>
                        <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded-md">(Reasoning)</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-gray-300 text-xs">
                            <Wand2 className="h-3 w-3 mr-1" />
                            High
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-300 text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            Attach
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
