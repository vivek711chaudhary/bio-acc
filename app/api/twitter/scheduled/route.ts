import { NextResponse } from 'next/server';
import { createTweet, getTrendingDiscussions, searchRecentTweets } from '@/lib/twitter';
import { agentConfig } from '@/app/config/agent-config';

async function generateTweetContent(context: string) {
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
            content: `${agentConfig.systemPrompt}\n\nCreate an engaging tweet about BIO/ACC or DeSci. The tweet should be informative, engaging, and under 280 characters.`
          },
          {
            role: 'user',
            content: `Generate a tweet based on this context: ${context}`
          }
        ],
        temperature: 0.8,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating tweet content:', error);
    return null;
  }
}

export async function POST() {
  try {
    // Get trending topics and recent discussions
    const trends = await getTrendingDiscussions();
    const recentTweets = await searchRecentTweets('#biotech OR #DeSci OR #biotechnology');

    // Combine context from trends and recent discussions
    const context = `
      Trending topics: ${trends.slice(0, 3).map(trend => trend.name).join(', ')}
      Recent discussions: ${recentTweets.slice(0, 3).map(tweet => tweet.text).join(' | ')}
    `;

    // Generate tweet content
    const tweetContent = await generateTweetContent(context);

    if (!tweetContent) {
      throw new Error('Failed to generate tweet content');
    }

    // Post the tweet
    await createTweet(tweetContent);

    return NextResponse.json({ status: 'success', tweet: tweetContent });
  } catch (error) {
    console.error('Error in scheduled task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: Add GET method to manually trigger the scheduled task
export async function GET() {
  return POST();
} 