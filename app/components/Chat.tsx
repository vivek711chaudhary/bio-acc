'use client';

import { useState, useEffect, useRef } from 'react';
import { defaultMessages } from '../config/agent-config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Trash2, Copy, Check, SmilePlus, Search, Twitter, Globe, AlertTriangle, MessageSquare, Github } from "lucide-react";
import { format } from 'date-fns';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ModeToggle } from "@/components/mode-toggle";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  reactions?: string[];
}

const EMOJI_REACTIONS = ['👍', '❤️', '🚀', '💡', '🧬', '🔬', '🧪', '🤖', '🎯'];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load saved chat from localStorage on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem('bioAccChat');
    if (savedChat) {
      try {
        const parsedChat: Message[] = JSON.parse(savedChat);
        setMessages(parsedChat.map((msg: Message) => ({
          ...msg,
          timestamp: msg.timestamp || Date.now(),
          reactions: msg.reactions || []
        })));
      } catch (error) {
        console.error('Error loading chat:', error);
        // If there's an error loading the chat, start fresh
        setMessages(defaultMessages.map(msg => ({ 
          ...msg, 
          timestamp: Date.now(),
          reactions: [] 
        })));
      }
    } else {
      // Initialize with default messages
      setMessages(defaultMessages.map(msg => ({ 
        ...msg, 
        timestamp: Date.now(),
        reactions: [] 
      })));
    }
  }, []);

  // Save chat to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('bioAccChat', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
      reactions: []
    };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, newMessage],
        }),
      });

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now(),
        reactions: []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(defaultMessages.map(msg => ({ ...msg, timestamp: Date.now(), reactions: [] })));
    localStorage.removeItem('bioAccChat');
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const addReaction = (messageIndex: number, emoji: string) => {
    setMessages(prev => prev.map((msg, idx) => {
      if (idx === messageIndex) {
        const reactions = msg.reactions || [];
        if (reactions.includes(emoji)) {
          return { ...msg, reactions: reactions.filter(r => r !== emoji) };
        }
        return { ...msg, reactions: [...reactions, emoji] };
      }
      return msg;
    }));
  };

  const renderContent = (content: string, messageIndex: number) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
            {content.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2];
      parts.push(
        <div key={`code-${match.index}`} className="relative my-2 rounded-md overflow-hidden border">
          <div className="absolute right-2 top-2 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
              onClick={() => handleCopyCode(code, messageIndex)}
            >
              {copiedIndex === messageIndex ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy code</span>
            </Button>
          </div>
          <div className="bg-zinc-950 text-zinc-50">
            <SyntaxHighlighter
              language={language}
              style={atomDark}
              customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key={`text-${lastIndex}`} className="whitespace-pre-wrap">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Only render timestamps on client side
  const formatTimestamp = (timestamp: number) => {
    if (!isClient) return '';
    return format(timestamp, 'HH:mm');
  };

  return (
    <div className="h-full flex flex-col max-h-full">
      <Card className="flex-1 backdrop-blur-sm bg-background/95 border shadow-lg flex flex-col overflow-hidden">
        <CardContent className="p-2 md:p-4 h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex flex-col gap-2 md:gap-4 mb-2 md:mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-green-500 animate-pulse" />
                <h2 className="text-lg md:text-xl font-bold">Chat Assistant</h2>
              </div>
              {/* Icons - Responsive Layout */}
              <div className="flex items-center gap-1 md:gap-2">
                {/* Mobile Icons (visible only on smaller than lg screens) */}
                <div className="flex lg:hidden items-center gap-1">
                  <ModeToggle />
                  <a
                    href="https://t.me/bioaccbot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:scale-110 transition-all rounded-full bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Telegram</span>
                  </a>
                  <a
                    href="https://github.com/bioacc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 hover:scale-110 transition-all rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
                  >
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </div>
                {/* Common Icons (visible on all screens) */}
                <a
                  href="https://x.com/BIOACC_SOL_CTO"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 md:p-1.5 hover:scale-110 transition-all rounded-full bg-black text-white hover:bg-zinc-800"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="https://www.bioacc.meme/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 md:p-1.5 hover:scale-110 transition-all rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Website</span>
                </a>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-destructive/10 hover:text-destructive h-8 w-8 hover:scale-110 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear chat</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px] bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Clear Chat History
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This action cannot be undone. This will permanently delete your
                        chat history and reset to the default messages.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="hover:bg-secondary/80">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearChat}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Clear History
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-7 text-sm h-8"
                />
              </div>
            </div>
          </div>

          {/* Messages Area - Fixed height container with overflow handling */}
          <div className="flex-1 min-h-0 relative">
            <ScrollArea className="h-full pr-4 overflow-y-auto">
              <div className="space-y-4 pb-2">
                {(searchQuery ? filteredMessages : messages).map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="group relative">
                      <div
                        className={`rounded-lg p-2 md:p-3 max-w-[85%] ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-6 md:ml-8'
                            : 'bg-secondary text-secondary-foreground mr-6 md:mr-8'
                        } shadow-sm transition-all duration-200`}
                      >
                        {renderContent(message.content, index)}
                        <div className="mt-2 flex items-center justify-between text-xs">
                          <time className={`${message.role === 'user' ? 'text-primary-foreground/70' : 'text-secondary-foreground/70'}`}>
                            {formatTimestamp(message.timestamp)}
                          </time>
                        </div>
                        {message.reactions && message.reactions.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {message.reactions.map((emoji, emojiIndex) => (
                              <span
                                key={emojiIndex}
                                className={`inline-flex items-center justify-center rounded-full ${
                                  message.role === 'user' 
                                    ? 'bg-primary-foreground/10 text-primary-foreground' 
                                    : 'bg-secondary-foreground/10 text-secondary-foreground'
                                } px-1.5 py-0.5 text-xs hover:scale-110 transition-transform cursor-pointer`}
                                onClick={() => addReaction(index, emoji)}
                              >
                                {emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-6 md:-right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          >
                            <SmilePlus className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-1" side="right">
                          <div className="flex flex-wrap gap-1">
                            {EMOJI_REACTIONS.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(index, emoji)}
                                className="text-base hover:scale-125 transition-transform p-1 rounded hover:bg-secondary"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary rounded-lg p-3 max-w-[85%] mr-6 md:mr-8">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-secondary-foreground animate-bounce [animation-delay:-0.3s] opacity-70" />
                          <div className="h-1.5 w-1.5 rounded-full bg-secondary-foreground animate-bounce [animation-delay:-0.15s] opacity-80" />
                          <div className="h-1.5 w-1.5 rounded-full bg-secondary-foreground animate-bounce opacity-90" />
                        </div>
                        <span className="text-xs text-secondary-foreground/70">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area - Fixed at the bottom */}
          <form onSubmit={handleSubmit} className="flex gap-2 mt-2 pt-1 bg-background/95 backdrop-blur-sm z-10">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about BIO/ACC, DeSci, or biotechnology..."
              className="flex-1 text-sm h-9 py-2"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="px-3 h-9 text-sm"
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}