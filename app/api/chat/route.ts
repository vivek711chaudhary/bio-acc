import { NextResponse } from 'next/server';
import { agentConfig } from '@/app/config/agent-config';
import OpenAI from 'openai';

// Initialize the OpenAI client with the exact API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();


    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: agentConfig.systemPrompt
        },
        ...messages
      ],
      temperature: agentConfig.temperature,
      max_tokens: agentConfig.max_tokens,
    });

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