import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar";


export function TypingIndicator() {
    return (
        <div className="flex gap-3 max-w-[80%] mr-auto">
            <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground">John Doe</span>

                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                        <div
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                        />
                        <div
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                        />
                        <div
                            className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
