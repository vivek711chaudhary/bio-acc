import { TwitterApi } from 'twitter-api-v2';
import crypto from 'crypto';

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY!,
  appSecret: process.env.TWITTER_CONSUMER_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

export const twitterClient = client.readWrite;

export function generateCrcResponse(crcToken: string): string {
  const hmac = crypto
    .createHmac('sha256', process.env.TWITTER_CONSUMER_SECRET!)
    .update(crcToken)
    .digest('base64');
  
  return `sha256=${hmac}`;
}

export async function sendDirectMessage(userId: string, text: string) {
  try {
    await twitterClient.v2.sendDmToParticipant(userId, {
      text,
    });
    return true;
  } catch (error) {
    console.error('Error sending DM:', error);
    return false;
  }
}

export async function replyToTweet(tweetId: string, text: string) {
  try {
    await twitterClient.v2.reply(text, tweetId);
    return true;
  } catch (error) {
    console.error('Error replying to tweet:', error);
    return false;
  }
}

export async function createTweet(text: string) {
  try {
    await twitterClient.v2.tweet(text);
    return true;
  } catch (error) {
    console.error('Error creating tweet:', error);
    return false;
  }
}

interface TrendingTopic {
  name: string;
  tweet_volume: number | null;
}

export async function getTrendingDiscussions(): Promise<TrendingTopic[]> {
  try {
    const response = await fetch('https://api.twitter.com/1.1/trends/place.json?id=1', {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    });

    const data = await response.json();
    if (!Array.isArray(data) || !data[0]?.trends) return [];

    return data[0].trends.map((trend: any) => ({
      name: trend.name,
      tweet_volume: trend.tweet_volume || null
    }));
  } catch (error) {
    console.error('Error fetching trends:', error);
    return [];
  }
}

interface Tweet {
  id: string;
  text: string;
}

export async function searchRecentTweets(query: string): Promise<Tweet[]> {
  try {
    const response = await fetch(
      `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    );

    const data = await response.json();
    if (!data?.data) return [];

    return data.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text || ''
    }));
  } catch (error) {
    console.error('Error searching tweets:', error);
    return [];
  }
}