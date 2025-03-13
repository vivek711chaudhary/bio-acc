'use client';

import MemeChat, { WELCOME_MESSAGE } from '../components/MemeChat';
import { Button } from "@/components/ui/button";
import { GithubIcon, TwitterIcon, Send, Globe, BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/mode-toggle";

export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string | MessageContent[];
  timestamp: number;
}

export default function MemePage() {
  return (
    <TooltipProvider>
      <main className="h-screen flex overflow-hidden bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/5">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex w-16 border-r bg-background/80 backdrop-blur-sm flex-col items-center py-6 gap-6">
          {/* Top Section - Social Links */}
          <div className="flex flex-col items-center gap-4 m-20">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-10 h-10 transition-all hover:scale-110 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 rounded-full p-0" asChild>
                  <a href="https://www.bioacc.meme/" target="_blank" rel="noopener noreferrer">
                    <Globe className="w-5 h-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Visit BIO/ACC Website</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-10 h-10 transition-all hover:scale-110 bg-black hover:bg-zinc-800 text-white rounded-full p-0" asChild>
                  <a href="https://x.com/USDesci" target="_blank" rel="noopener noreferrer">
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Follow us on Twitter</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-10 h-10 transition-all hover:scale-110 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full p-0" asChild>
                  <a href="https://github.com/Bio-Acc" target="_blank" rel="noopener noreferrer">
                    <GithubIcon className="w-5 h-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-10 h-10 transition-all hover:scale-110 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full p-0" asChild>
                  <a href="https://docs.bio.xyz/bio" target="_blank" rel="noopener noreferrer">
                    <BookOpen className="w-5 h-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Read Documentation</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Middle Section - Telegram */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" className="w-10 h-10 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white hover:scale-105 transition-transform rounded-full p-0" asChild>
                  <a href="https://t.me/bioaccbot" target="_blank" rel="noopener noreferrer">
                    <Send className="w-5 h-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Chat with us on Telegram</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="h-8"></div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="relative z-10 py-2 sm:py-4 bg-background/80 backdrop-blur-sm border-b">
            <div className="max-w-4xl mx-auto px-3 sm:px-4 flex items-center justify-between">
              <div className="relative inline-block animate-float">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary opacity-75 blur animate-pulse"></div>
                <h1 className="relative text-xl sm:text-2xl md:text-3xl font-bold text-foreground bg-background px-2 sm:px-3 py-1 animate-reveal">
                  BIO/ACC Meme Generator
                </h1>
              </div>
              <ModeToggle />
            </div>
          </header>

          {/* Meme Chat Section */}
          <div className="flex-1 relative bg-background/40 overflow-hidden">
            <div className="absolute inset-0 px-2 sm:px-4 py-2 sm:py-4 overflow-hidden">
              <div className="h-full max-w-5xl mx-auto overflow-y-auto">
                <MemeChat 
                  conversationId=""
                  messages={[{
                    role: 'assistant',
                    content: WELCOME_MESSAGE.content,
                    timestamp: Date.now(),
                    reactions: []
                  }]}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </TooltipProvider>
  );
}