import { NextResponse } from 'next/server';
import { memeAgentConfig } from '@/app/config/meme-agent-config';
import OpenAI from 'openai';

interface MessageContent {
  type: string;
  text?: string;
  image_url?: string;
}

interface Message {
  role: string;
  content: string | MessageContent[];
}

// Initialize the OpenAI client with the exact API key

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Check for image content
    const hasImage = Array.isArray(lastMessage.content) && 
      lastMessage.content.some((item: MessageContent) => item.type === 'image_url');

    // Properly format messages for OpenAI API
    const formattedMessages = messages.map((msg: Message) => {
      if (Array.isArray(msg.content)) {
        // Handle messages with image content
        return {
          role: msg.role,
          content: msg.content.map((item: MessageContent) => {
            if (item.type === 'image_url') {
              return {
                type: 'image_url',
                image_url: item.image_url
              };
            }
            return { type: 'text', text: item.text };
          })
        };
      }
      // Handle regular text messages
      return {
        role: msg.role,
        content: msg.content
      };
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: hasImage ? memeAgentConfig.imageAnalysisPrompt : memeAgentConfig.systemPrompt
        },
        ...formattedMessages
      ],
      max_tokens: 1000,
    });

    console.log("this is the response",completion.choices[0].message.content);
    return NextResponse.json({
      choices: [{
        message: completion.choices[0].message,
        finish_reason: completion.choices[0].finish_reason,
      }],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 