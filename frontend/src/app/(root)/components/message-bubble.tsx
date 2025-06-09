
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar"
import { cn } from "@/lib/utils"

interface Message {
    id: number
    content: string
    sender: string
    timestamp: string
    isOwn: boolean
    avatar: string
}

interface MessageBubbleProps {
    message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
    return (
        <div className={cn("flex gap-3 max-w-[80%]", message.isOwn ? "ml-auto flex-row-reverse" : "mr-auto")}>
            {!message.isOwn && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={message.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                        {message.sender
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn("flex flex-col gap-1", message.isOwn ? "items-end" : "items-start")}>
                {!message.isOwn && <span className="text-xs font-medium text-muted-foreground">{message.sender}</span>}

                <div
                    className={cn(
                        "rounded-2xl px-4 py-2 max-w-full break-words",
                        message.isOwn ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted rounded-bl-md",
                    )}
                >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                </div>

                <span className="text-xs text-muted-foreground">{message.timestamp}</span>
            </div>
        </div>
    )
}
