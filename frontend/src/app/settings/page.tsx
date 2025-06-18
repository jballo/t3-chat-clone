"use client"

import { useState } from "react"
import { ChevronLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/atoms/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/atoms/avatar"
import { Progress } from "@/atoms/progress"
import { SignOutButton } from "@clerk/nextjs"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("account")

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            {/* Header */}
            <header className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
                <Link href="/" className="flex items-center text-gray-300 hover:text-white">
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    <span>Back to Chat</span>
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="text-gray-300 hover:text-white">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-white"
                        >
                            <path
                                d="M12 3V3.01M12 21V21.01M21 12H20.99M3 12H3.01M18.364 18.364L18.354 18.354M5.636 5.636L5.646 5.646M18.364 5.636L18.354 5.646M5.636 18.364L5.646 18.354"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </Button>
                    <SignOutButton>
                        <Button variant="ghost" className="text-gray-300 hover:text-white">
                            Sign out
                        </Button>
                    </SignOutButton>
                </div>
            </header>

            {/* Profile section */}
            <div className="flex flex-col items-center py-8">
                <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src="/images/avatar.png" />
                    <AvatarFallback className="text-3xl">JB</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">Jonathan Ballona Sanchez</h1>
                <p className="text-gray-400">jballonasanchez@gmail.com</p>
                <div className="mt-2">
                    <Button variant="outline" className="bg-[#3a1a2f] hover:bg-[#4a2a3f] text-white border-[#4a2a3f]">
                        Pro Plan
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex border-b border-[#2a2a2a] mb-6">
                    <Button
                        variant="ghost"
                        className={`px-6 py-3 rounded-none ${activeTab === "account" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("account")}
                    >
                        Account
                    </Button>
                    <Button
                        variant="ghost"
                        className={`px-6 py-3 rounded-none ${activeTab === "customization" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("customization")}
                    >
                        Customization
                    </Button>
                    <Button
                        variant="ghost"
                        className={`px-6 py-3 rounded-none ${activeTab === "history" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("history")}
                    >
                        History & Sync
                    </Button>
                    <Button
                        variant="ghost"
                        className={`px-6 py-3 rounded-none ${activeTab === "models" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("models")}
                    >
                        Models
                    </Button>
                    <Button
                        variant="ghost"
                        className={`px-6 py-3 rounded-none ${activeTab === "api" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("api")}
                    >
                        API Keys
                    </Button>
                    <Button
                        variant="ghost"
                        className={`px-6 py-3 rounded-none ${activeTab === "attachments" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("attachments")}
                    >
                        Attachments
                    </Button>
                    <Button
                        variant="ghost"
                        className={`px-6 py-3 rounded-none ${activeTab === "contact" ? "border-b-2 border-purple-500 text-white" : "text-gray-400"
                            }`}
                        onClick={() => setActiveTab("contact")}
                    >
                        Contact Us
                    </Button>
                </div>

                {/* Pro Plan Benefits */}
                <h2 className="text-2xl font-bold mb-6">Pro Plan Benefits</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6">
                        <div className="flex items-center mb-4 text-purple-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <h3 className="ml-2 text-lg font-semibold">Access to All Models</h3>
                        </div>
                        <p className="text-gray-300">Get access to our full suite of models including Claude, o3-mini, and more!</p>
                    </div>

                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6">
                        <div className="flex items-center mb-4 text-purple-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <h3 className="ml-2 text-lg font-semibold">Generous Limits</h3>
                        </div>
                        <p className="text-gray-300">
                            Receive <span className="font-bold">1500 standard credits</span> per month, plus{" "}
                            <span className="font-bold">100 premium credits*</span> per month.
                        </p>
                    </div>

                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6">
                        <div className="flex items-center mb-4 text-purple-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <h3 className="ml-2 text-lg font-semibold">Priority Support</h3>
                        </div>
                        <p className="text-gray-300">
                            Get faster responses and dedicated assistance from the T3 team whenever you need help!
                        </p>
                    </div>
                </div>

                {/* Message Usage */}
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Message Usage</h2>
                        <span className="text-sm text-gray-400">Resets 06/30/2025</span>
                    </div>

                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">Standard</span>
                            <span className="text-gray-300">24/1500</span>
                        </div>
                        <Progress value={1.6} className="h-2 bg-[#2a2a2a] [--progress-indicator:theme(colors.purple.500)]" />
                        <p className="mt-2 text-sm text-gray-400">1476 messages remaining</p>
                    </div>

                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className="text-gray-300">Premium</span>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="ml-2 text-gray-400"
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-gray-300">26/100</span>
                        </div>
                        <Progress value={26} className="h-2 bg-[#2a2a2a] [--progress-indicator:theme(colors.purple.500)]" />
                        <p className="mt-2 text-sm text-gray-400">74 messages remaining</p>
                    </div>

                    <div className="mt-4">
                        <Button className="bg-[#3a1a2f] hover:bg-[#4a2a3f] text-white flex items-center">
                            Buy more premium credits
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Keyboard Shortcuts */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4">Keyboard Shortcuts</h2>
                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-300">Search</span>
                            <div className="flex items-center gap-1">
                                <kbd className="px-2 py-1 bg-[#2a2a2a] rounded text-xs">⌘</kbd>
                                <kbd className="px-2 py-1 bg-[#2a2a2a] rounded text-xs">K</kbd>
                            </div>
                        </div>
                        {/* Add more keyboard shortcuts here */}
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h2>
                    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-lg p-6">
                        <p className="text-gray-300 mb-4">Permanently delete your account and all associated data.</p>
                        <Button variant="destructive">Delete Account</Button>
                    </div>
                </div>

                {/* Premium credits note */}
                <div className="text-sm text-gray-400 mb-10">
                    <p>
                        * Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok 3. Additional Premium credits can be
                        purchased separately.
                    </p>
                </div>
            </div>
        </div>
    )
}
