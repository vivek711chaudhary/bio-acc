import { NextResponse } from 'next/server';
import { sendDirectMessage, replyToTweet, generateCrcResponse } from '@/lib/twitter';
import { agentConfig } from '@/app/config/agent-config';

// Helper function to process message with AI
async function processWithAI(text: string) {
  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: agentConfig.model,
        messages: [
          {
            role: 'system',
            content: agentConfig.systemPrompt
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: agentConfig.temperature,
        max_tokens: agentConfig.max_tokens,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error processing with AI:', error);
    return 'Sorry, I encountered an error processing your request.';
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Handle direct messages
    if (payload.direct_message_events) {
      const message = payload.direct_message_events[0];
      const senderId = message.message_create.sender_id;
      const text = message.message_create.message_data.text;

      // Don't process messages from the bot itself
      if (senderId === process.env.TWITTER_USER_ID) {
        return NextResponse.json({ status: 'ignored self message' });
      }

      // Process message with AI
      const response = await processWithAI(text);
      
      // Send response back as DM
      await sendDirectMessage(senderId, response);
    }

    // Handle mentions
    if (payload.tweet_create_events) {
      const tweet = payload.tweet_create_events[0];
      
      // Don't process tweets from the bot itself
      if (tweet.user.id_str === process.env.TWITTER_USER_ID) {
        return NextResponse.json({ status: 'ignored self tweet' });
      }

      // Process tweet with AI
      const response = await processWithAI(tweet.text);
      
      // Reply to the tweet
      await replyToTweet(tweet.id_str, response);
    }

    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Twitter webhook CRC check
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const crc_token = searchParams.get('crc_token');

    if (!crc_token) {
      return NextResponse.json({ error: 'Missing crc_token' }, { status: 400 });
    }

    const response_token = generateCrcResponse(crc_token);
    return NextResponse.json({ response_token });
  } catch (error) {
    console.error('Error handling CRC:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 