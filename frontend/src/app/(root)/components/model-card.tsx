"use client"

import { Eye, Globe, FileText, Wand2 } from "lucide-react"

interface ModelCardProps {
    model: {
        id: string
        name: string
        subName?: string
        icon: string
        capabilities: string[]
        isPro?: boolean
        isDegraded?: boolean
        isNew?: boolean
    }
    onClick: () => void
}

export function ModelCard({ model, onClick }: ModelCardProps) {
    const getModelIcon = () => {
        switch (model.icon) {
            case "gemini":
                return <div className="text-white text-2xl flex items-center justify-center">✧</div>
            case "claude":
                return <div className="text-white text-xl font-bold flex items-center justify-center">AI</div>
            case "gpt":
            case "o4":
            case "o3":
            case "deepseek":
                return (
                    <div className="text-white flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div
            className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-3 cursor-pointer hover:border-[#3a3a3a] transition-colors"
            onClick={onClick}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                    {getModelIcon()}

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
                            {model.isNew && <span className="text-xs px-1.5 py-0.5 bg-purple-900/30 text-purple-400 rounded">4</span>}
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
    )
}
