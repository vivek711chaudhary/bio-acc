import { NextResponse } from 'next/server';
import { agentConfig } from '@/app/config/agent-config';

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const API_URL = 'https://api.together.xyz/v1/chat/completions';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: agentConfig.model,
        messages: [
          {
            role: 'system',
            content: agentConfig.systemPrompt
          },
          ...messages
        ],
        temperature: agentConfig.temperature,
        max_tokens: agentConfig.max_tokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 