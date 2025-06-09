"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Info } from "lucide-react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar"
import { Button } from "@/atoms/button"
import { ScrollArea } from "@/atoms/scroll-area"
import { Input } from "@/atoms/input"

export function ChatArea() {
    const [message, setMessage] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    const messages = [
        {
            id: 1,
            content: "Hey! How are you doing today?",
            sender: "John Doe",
            timestamp: "10:30 AM",
            isOwn: false,
            avatar: "/placeholder.svg?height=32&width=32",
        },
        {
            id: 2,
            content: "I'm doing great! Just working on the new T3 chat application. The UI is coming together nicely.",
            sender: "You",
            timestamp: "10:32 AM",
            isOwn: true,
            avatar: "/placeholder.svg?height=32&width=32",
        },
        {
            id: 3,
            content: "That sounds awesome! Can you show me a preview?",
            sender: "John Doe",
            timestamp: "10:33 AM",
            isOwn: false,
            avatar: "/placeholder.svg?height=32&width=32",
        },
        {
            id: 4,
            content: "I'll send you the link once it's deployed. The design is really clean and modern.",
            sender: "You",
            timestamp: "10:35 AM",
            isOwn: true,
            avatar: "/placeholder.svg?height=32&width=32",
        },
        {
            id: 5,
            content: "Perfect! Looking forward to seeing it. By the way, are we still on for the meeting tomorrow?",
            sender: "John Doe",
            timestamp: "10:36 AM",
            isOwn: false,
            avatar: "/placeholder.svg?height=32&width=32",
        },
    ]

    const handleSendMessage = () => {
        if (message.trim()) {
            // Here you would typically send the message to your backend
            console.log("Sending message:", message)
            setMessage("")
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    useEffect(() => {
        // Simulate typing indicator
        const timer = setTimeout(() => setIsTyping(true), 2000)
        const timer2 = setTimeout(() => setIsTyping(false), 5000)

        return () => {
            clearTimeout(timer)
            clearTimeout(timer2)
        }
    }, [])

    return (
        <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    </div>
                    <div>
                        <h3 className="font-semibold">John Doe</h3>
                        <p className="text-sm text-muted-foreground">Active now</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))}
                    {isTyping && <TypingIndicator />}
                </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-background">
                <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <Paperclip className="h-4 w-4" />
                    </Button>

                    <div className="flex-1 relative">
                        <Input
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="pr-10 resize-none"
                        />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8">
                            <Smile className="h-4 w-4" />
                        </Button>
                    </div>

                    <Button onClick={handleSendMessage} disabled={!message.trim()} className="shrink-0">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
