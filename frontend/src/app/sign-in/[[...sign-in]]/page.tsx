"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex w-full min-h-screen justify-center items-center">
            <SignIn />
        </div>
    );
}
