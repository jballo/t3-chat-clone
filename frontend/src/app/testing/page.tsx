"use client";

import { Authenticated, Unauthenticated, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/atoms/button";

function Content() {
    const tasks = useQuery(api.tasks.get);
    const chats = useQuery(api.chat.getChats);

    console.log("Chats: ", chats);
    const createChat = useMutation(api.chat.createChat);

    const handleClick = () => {
        createChat();
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Button
                onClick={handleClick}
            >Create Chat</Button>
            {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
        </main>
    );
}

export default function Home() {
    return (
        <>
            <Unauthenticated>
                <SignInButton />
            </Unauthenticated>
            <Authenticated>
                <UserButton />
                <Content />
            </Authenticated>
        </>
    );
}

