"use client"

import { Button } from "@/atoms/button"
import { ChevronDown } from "lucide-react"

interface ModelDropdownProps {
    selectedModel: {
        name: string
        type: string
        icon: string
    }
    onClick: () => void
}

export function ModelDropdown({ selectedModel, onClick }: ModelDropdownProps) {
    return (
        <Button
            variant="ghost"
            className="flex items-center gap-2 h-9 px-3 text-sm text-gray-300 hover:text-white hover:bg-[#2a2a2a] rounded-xl transition-colors duration-200 border border-[#3a3a3a] hover:border-[#3a1a2f]"
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#8b5cf6] rounded-full" />
                <span className="font-medium">{selectedModel.name}</span>
                <span className="text-xs text-gray-400 bg-[#2a2a2a] px-2 py-0.5 rounded-md">{selectedModel.type}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
        </Button>
    )
}
