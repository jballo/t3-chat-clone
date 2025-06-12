"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/atoms/popover";
import { ModelDropdownButton } from "./model-dropdown";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/atoms/command";

interface ModelSelectorProps {
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
}

const allModels = [
    {
        id: "llama-3.1-8b-instant",
        name: "LLama 3.1 8b",
        icon: "llama",
        capabilities: ["multilingual", "speed"],
    },
    {
        id: "llama-3.3-70b-versatile",
        name: "Llama 3.3 70b",
        icon: "llama",
        capabilities: ["multilingual"],
    },
    {
        id: "mistral-saba-24b",
        name: "Mistral Saba 24B",
        icon: "Mistral",
        capabilities: ["multilingual"],
    },
    {
        id: "deepseek-r1-distill-llama-70b",
        name: "DeepSeek R1 Distilled Llama",
        icon: "deepseek",
        capabilities: ["reasoning", "speed"],
    },
    {
        id: "gemini-2.0-flash",
        name: "Gemini 2.0 Flash",
        icon: "gemini",
        capabilities: ["image", "search", "pdf"]
    }
    // {
    //     id: "gpt-imagegen",
    //     name: "GPT ImageGen",
    //     icon: "gpt",
    //     capabilities: ["vision"],
    // },
]

export function ModelSelector({ selectedModel, setSelectedModel }: ModelSelectorProps) {
    return (
        <Popover>
            <PopoverTrigger>
                <ModelDropdownButton selectedModel={selectedModel} />
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Type model name here..." />
                    <CommandList>
                        <CommandEmpty>No Model Found</CommandEmpty>
                        {allModels.map(model => (
                            <CommandItem
                                key={model.id}
                                onSelect={() => {
                                    setSelectedModel(model);
                                }}
                            >
                                {model.name}
                            </CommandItem>
                        ))}
                        {/* <CommandItem>Llama 4</CommandItem> */}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}