'use client';

import { useState, useEffect, useRef } from 'react';
import { defaultMessages } from '../config/agent-config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Load saved chat from localStorage on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem('bioAccChat');
    if (savedChat) {
      setMessages(JSON.parse(savedChat));
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

    const newMessage: Message = { role: 'user', content: input };
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
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages(defaultMessages);
      localStorage.removeItem('bioAccChat');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">BIO/ACC Chat</h2>
          <Button
            onClick={handleClearChat}
            variant="destructive"
            size="sm"
          >
            Clear Chat
          </Button>
        </div>

        <ScrollArea className="h-[600px] pr-4 mb-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-4 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about BIO/ACC, DeSci, or biotechnology..."
            className="flex-1 text-base"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Send'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 