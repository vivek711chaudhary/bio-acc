'use client';

import { useState, useEffect, useRef } from 'react';
import { memeAgentConfig } from '../config/meme-agent-config';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Twitter, MessageSquare, Repeat, Heart, AlertCircle, User, Plus, Trash2, Send } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import NextImage from "next/image";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  reactions?: string[];
  image?: {
    type: 'url' | 'file';
    url: string;
  };
  id?: string;
  title?: string;
}

interface TwitterMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: TwitterMetrics;
  username?: string;
}

interface HashtagResult {
  hashtag: string;
  results: Tweet[];
  isLoading: boolean;
}

interface TwitterFeature {
  enabled: boolean;
  hashtagResults: Record<string, HashtagResult>;
}

interface Conversation {
  id: string;
  messages: Message[];
  timestamp: number;
  title: string;
}

interface MessageContent {
  type: 'text' | 'image_url';
  text: string;
  image_url?: {
    url: string;
  };
}

const TEST_HASHTAGS = [
  '#BioTech',
  '#SyntheticBiology',
  '#CRISPR',
  '#BioInformatics',
  '#LabMemes',
  '#ScienceMemes'
];

export const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: `👋 Welcome to the BIO/ACC Meme Analyzer!

Let's test some biotech hashtags:
${TEST_HASHTAGS.join(' ')}

Toggle the Twitter Search feature in the top-right corner to:
- Click hashtags to open Twitter directly (when disabled)
- Get related tweets right here (when enabled)

You can also analyze memes by:
- Pasting an image URL
- Uploading an image file`,
  timestamp: Date.now(),
  reactions: []
};

interface HashtagButtonProps {
  tag: string;
  onClick: () => void;
  twitterEnabled: boolean;
}

const HashtagButton = ({ tag, onClick, twitterEnabled }: HashtagButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`
        rounded-full text-xs
        ${twitterEnabled 
          ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20' 
          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
      `}
      onClick={onClick}
    >
      {tag}
      {twitterEnabled && <Twitter className="w-3 h-3 ml-1" />}
    </Button>
  );
};

const TwitterToggle = ({ 
  enabled, 
  onToggle 
}: { 
  enabled: boolean; 
  onToggle: (checked: boolean) => void 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <Switch
              id="twitter-mode"
              checked={enabled}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-blue-500"
            />
            <Label 
              htmlFor="twitter-mode" 
              className="text-sm font-medium cursor-pointer flex items-center gap-2"
            >
              Twitter Search
              <Badge 
                variant={enabled ? "default" : "secondary"}
                className={`${enabled ? 'bg-blue-500' : ''} transition-colors`}
              >
                {enabled ? 'ON' : 'OFF'}
              </Badge>
            </Label>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Enable to fetch related tweets when clicking hashtags</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const Tweet: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
  return (
    <div className="p-3 rounded-lg bg-secondary/30 backdrop-blur-sm hover:bg-secondary/40 transition-colors">
      <p className="text-sm text-secondary-foreground mb-2">{tweet.text}</p>
      <div className="flex items-center gap-4 text-xs text-secondary-foreground/70">
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3" /> {tweet.public_metrics.reply_count}
        </span>
        <span className="flex items-center gap-1">
          <Repeat className="h-3 w-3" /> {tweet.public_metrics.retweet_count}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-3 w-3" /> {tweet.public_metrics.like_count}
        </span>
        {tweet.username && (
          <span className="flex items-center gap-1 ml-auto">
            <User className="h-3 w-3" /> @{tweet.username}
          </span>
        )}
      </div>
    </div>
  );
};

const TwitterResults: React.FC<{
  results: Tweet[];
  isLoading: boolean;
  hashtag: string;
}> = ({ results, isLoading, hashtag }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg bg-secondary/30 p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-sm text-secondary-foreground">
            Fetching tweets for {hashtag}...
          </span>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="rounded-lg bg-secondary/30 p-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-secondary-foreground" />
          <span className="text-sm text-secondary-foreground">
            No tweets found for {hashtag}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Twitter className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-secondary-foreground">
          Found {results.length} tweets for {hashtag}
        </span>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {results.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

interface AnalysisResponseProps {
  content: string;
  twitterFeature: TwitterFeature;
  onHashtagClick: (tag: string) => void;
}

const AnalysisResponse: React.FC<AnalysisResponseProps> = ({ 
  content, 
  twitterFeature, 
  onHashtagClick 
}) => {
  // Extract hashtags from content using regex
  const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];

  return (
    <div className="space-y-4">
      <div className="prose prose-sm dark:prose-invert max-w-none">
        {content.split(/(\s+)/).map((part, index) => {
          if (part.startsWith('#')) {
            return (
              <HashtagButton
                key={index}
                tag={part}
                onClick={() => onHashtagClick(part)}
                twitterEnabled={twitterFeature.enabled}
              />
            );
          }
          return part;
        })}
      </div>
      {twitterFeature.enabled && hashtags.map(tag => {
        const result = twitterFeature.hashtagResults[tag];
        if (result) {
          return (
            <TwitterResults
              key={tag}
              results={result.results}
              isLoading={result.isLoading}
              hashtag={tag}
            />
          );
        }
        return null;
      })}
    </div>
  );
};

interface MemeChatProps {
  conversationId: string;
  messages: Message[];
  onMessagesUpdate?: (messages: Message[]) => void;
}

export default function MemeChat({ 
  conversationId, 
  messages: initialMessages = [], 
  onMessagesUpdate = () => {} 
}: MemeChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [twitterFeature, setTwitterFeature] = useState<TwitterFeature>({
    enabled: false,
    hashtagResults: {}
  });

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('memeConversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setTwitterFeature(prev => ({
        ...prev,
        hashtagResults: parsed.reduce((acc: Record<string, HashtagResult>, conv: Conversation) => {
          acc[conv.id] = {
            hashtag: '',
            results: conv.messages
              .map(m => m.image?.url ? {
                id: '',
                text: '',
                created_at: '',
                public_metrics: { 
                  retweet_count: 0, 
                  reply_count: 0, 
                  like_count: 0 
                }
              } : undefined)
              .filter((item): item is Tweet => item !== undefined),
            isLoading: false
          };
          return acc;
        }, {})
      }));
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('memeConversations', JSON.stringify(messages.map(m => ({
      id: Date.now().toString(),
      messages: [m],
      timestamp: Date.now(),
      title: m.role === 'user' ? m.content : 'New Meme Analysis'
    }))));
  }, [messages]);

  const handleTwitterToggle = (checked: boolean) => {
    setTwitterFeature(prev => ({ ...prev, enabled: checked }));
  };

  const handleHashtagClick = async (tag: string) => {
    if (!twitterFeature.enabled) {
      window.open(`https://twitter.com/search?q=${encodeURIComponent(tag)}`, '_blank');
      return;
    }

    // Update only the specific hashtag's results
    setTwitterFeature(prev => ({
      ...prev,
      hashtagResults: {
        ...prev.hashtagResults,
        [tag]: {
          hashtag: tag,
          results: [],
          isLoading: true
        }
      }
    }));

    try {
      const response = await fetch('/api/twitter-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashtag: tag }),
      });
      const data = await response.json();
      
      setTwitterFeature(prev => ({
        ...prev,
        hashtagResults: {
          ...prev.hashtagResults,
          [tag]: {
            hashtag: tag,
            results: data.results || [],
            isLoading: false
          }
        }
      }));
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setTwitterFeature(prev => ({
        ...prev,
        hashtagResults: {
          ...prev.hashtagResults,
          [tag]: {
            hashtag: tag,
            results: [],
            isLoading: false
          }
        }
      }));
    }
  };

  const updateMessages = (newMessages: Message[]) => {
    if (onMessagesUpdate) {
      onMessagesUpdate(newMessages);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    return (
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
            {message.image && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <NextImage 
                  src={message.image.url}
                  alt={message.title || "Message attachment"}
                  width={300}
                  height={200}
                  className="max-w-full rounded-lg"
                />
              </div>
            )}
            <div className="whitespace-pre-wrap">
              {message.role === 'assistant' ? (
                <AnalysisResponse 
                  content={message.content}
                  twitterFeature={twitterFeature}
                  onHashtagClick={handleHashtagClick}
                />
              ) : (
                message.content
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-secondary-foreground/70">
              <span>{formatTimestamp(message.timestamp)}</span>
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex gap-1">
                  {message.reactions.map((reaction, i) => (
                    <span key={i} className="cursor-pointer hover:text-primary" onClick={() => addReaction(index, reaction)}>
                      {reaction}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now(),
      reactions: []
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    onMessagesUpdate(newMessages);
    setInput('');

    setIsLoading(true);
    try {
      // TODO: Implement API call to process the message
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: Date.now(),
        reactions: []
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
      onMessagesUpdate(updatedMessages);
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        reactions: []
      };
      const errorMessages = [...newMessages, errorMessage];
      setMessages(errorMessages);
      onMessagesUpdate(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    setIsLoading(true);
    try {
      // Create and add user message with image first
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input || "What's in this image?",
        timestamp: Date.now(),
        image: {
          type: 'url',
          url: imageUrl
        }
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      onMessagesUpdate(updatedMessages);

      // Send to OpenAI for analysis
      const messageContent: MessageContent[] = [
        { 
          type: 'text', 
          text: newMessage.content 
        },
        {
          type: 'image_url',
          text: '',
          image_url: {
            url: imageUrl
          }
        }
      ];

      const response = await fetch('/api/meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: memeAgentConfig.imageAnalysisPrompt
            },
            {
              role: 'user',
              content: messageContent
            }
          ]
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Add AI's response
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now(),
        reactions: []
      };

      // Update messages with both the image and AI response
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      onMessagesUpdate(finalMessages);

    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while analyzing the image. Please try again.',
        timestamp: Date.now()
      };
      const errorMessages = [...messages, errorMessage];
      setMessages(errorMessages);
      onMessagesUpdate(errorMessages);
    } finally {
      setIsLoading(false);
      setImageUrl('');
      setInput('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input || "What's in this image?",
        timestamp: Date.now(),
        image: {
          type: 'file',
          url: base64String
        }
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      onMessagesUpdate(updatedMessages);

      // Send to OpenAI for analysis
      const messageContent: MessageContent[] = [
        { 
          type: 'text', 
          text: newMessage.content 
        },
        {
          type: 'image_url',
          text: '',
          image_url: {
            url: base64String
          }
        }
      ];

      const response = await fetch('/api/meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: memeAgentConfig.imageAnalysisPrompt
            },
            {
              role: 'user',
              content: messageContent
            }
          ]
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: Date.now(),
        reactions: []
      };

      // Update both local and parent state with assistant's response
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      onMessagesUpdate(finalMessages);

    } catch (error) {
      console.error('Error analyzing image:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while analyzing the image. Please try again.',
        timestamp: Date.now()
      };
      const errorMessages = [...messages, errorMessage];
      setMessages(errorMessages);
      onMessagesUpdate(errorMessages);
    } finally {
      setIsLoading(false);
      setInput('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addReaction = (messageIndex: number, emoji: string) => {
    const newMessages = [...messages];
    if (!newMessages[messageIndex].reactions) {
      newMessages[messageIndex].reactions = [];
    }
    if (!newMessages[messageIndex].reactions?.includes(emoji)) {
      newMessages[messageIndex].reactions?.push(emoji);
      setMessages(newMessages);
      onMessagesUpdate(newMessages);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="h-full flex">
      {/* Conversations Sidebar */}
      <div className="w-64 border-r border-secondary/20 bg-background/95 overflow-y-auto">
        <div className="p-4">
          <Button 
            onClick={() => updateMessages([...messages, {
              id: Date.now().toString(),
              role: 'user',
              content: '',
              timestamp: Date.now(),
              reactions: []
            }])}
            className="w-full mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          
          <div className="space-y-1">
            {messages?.map((conv, index) => (
              <div
                key={conv.id || index}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer",
                  conversationId === conv.id 
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-secondary/50"
                )}
                onClick={() => updateMessages(messages.filter(m => m.id === conv.id ? conv : null))}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">{conv.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the parent click from firing
                      updateMessages(messages.filter(m => m.id !== conv.id));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-secondary/20">
          <h2 className="font-semibold">
            {messages.find(c => c.id === conversationId)?.title || 'New Analysis'}
          </h2>
        </div>
        
        <Card className="flex-1 backdrop-blur-sm bg-background/95 border shadow-lg flex flex-col overflow-hidden">
          <CardContent className="p-2 md:p-4 h-full flex flex-col overflow-hidden">
            <div className="flex flex-col gap-2 md:gap-4 mb-2 md:mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-green-500 animate-pulse" />
                  <h2 className="text-lg md:text-xl font-bold">Meme Assistant</h2>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <ModeToggle />
                  <TwitterToggle 
                    enabled={twitterFeature.enabled} 
                    onToggle={handleTwitterToggle}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 relative">
              <ScrollArea className="h-full pr-4 overflow-y-auto">
                <div className="space-y-4 pb-2">
                  {messages.map((message, index) => renderMessage(message, index))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-secondary rounded-lg p-3 max-w-[85%] mr-6 md:mr-8">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-secondary-foreground animate-bounce [animation-delay:-0.3s]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-secondary-foreground animate-bounce [animation-delay:-0.15s]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-secondary-foreground animate-bounce" />
                          </div>
                          <span className="text-xs text-secondary-foreground/70">Analyzing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="mt-2 pt-2 border-t bg-background/95 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-6 w-6" />
                  )}
                </Button>
              </form>

              <Tabs defaultValue="url" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted">
                  <TabsTrigger 
                    value="url"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    URL
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upload"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground"
                  >
                    Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="url" className="mt-2">
                  <form onSubmit={handleImageUrlSubmit} className="flex gap-2">
                    <Input
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL..."
                      className="flex-1 bg-background border-input text-foreground placeholder:text-muted-foreground"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !imageUrl.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-6 w-6" />
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="upload" className="mt-2">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="w-full bg-background border-input text-foreground"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}