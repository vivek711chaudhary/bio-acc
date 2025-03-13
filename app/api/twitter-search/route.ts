import { NextResponse } from 'next/server';

const TWITTER_API_URL = 'https://api.twitter.com/2/tweets/search/recent';

interface TokenStatus {
  token: string;
  lastUsed: number;
  failureCount: number;
  rateLimitReset?: number;
}

// Initialize token statuses in memory
let tokenStatuses: TokenStatus[] = [];

// Function to initialize or refresh token statuses
function initializeTokenStatuses() {
  if (tokenStatuses.length === 0) {
    const tokens = [
      process.env.TWITTER_BEARER_TOKEN1,
      process.env.TWITTER_BEARER_TOKEN2,
      process.env.TWITTER_BEARER_TOKEN3
    ].filter(Boolean) as string[];

    tokenStatuses = tokens.map(token => ({
      token,
      lastUsed: 0,
      failureCount: 0
    }));
  }
}

// Function to get the best available token
function getBestToken(): TokenStatus | null {
  const now = Date.now();
  
  // Reset failure counts for tokens that have passed their rate limit reset time
  tokenStatuses.forEach(status => {
    if (status.rateLimitReset && now > status.rateLimitReset) {
      status.failureCount = 0;
      status.rateLimitReset = undefined;
    }
  });

  // Sort tokens by priority:
  // 1. Tokens with no failures
  // 2. Tokens with reset times that have passed
  // 3. Least recently used tokens
  const availableTokens = tokenStatuses
    .filter(status => status.failureCount < 3) // Skip tokens that have failed too many times
    .sort((a, b) => {
      // Prioritize tokens with no failures
      if (a.failureCount !== b.failureCount) {
        return a.failureCount - b.failureCount;
      }
      // Then prioritize by last used time
      return a.lastUsed - b.lastUsed;
    });

  return availableTokens[0] || null;
}

// Function to mark a token as failed
function markTokenFailure(token: string, resetTime?: number) {
  const tokenStatus = tokenStatuses.find(t => t.token === token);
  if (tokenStatus) {
    tokenStatus.failureCount++;
    tokenStatus.rateLimitReset = resetTime;
  }
}

// Function to update token's last used time
function markTokenSuccess(token: string) {
  const tokenStatus = tokenStatuses.find(t => t.token === token);
  if (tokenStatus) {
    tokenStatus.lastUsed = Date.now();
    tokenStatus.failureCount = 0;
    tokenStatus.rateLimitReset = undefined;
  }
}

export async function POST(req: Request) {
  if (!process.env.TWITTER_FEATURE_ENABLED) {
    return NextResponse.json({ 
      results: [],
      error: 'Twitter feature not configured'
    });
  }

  try {
    const { hashtag } = await req.json();
    const query = hashtag.replace('#', '');

    // Initialize token statuses if needed
    initializeTokenStatuses();

    // Try each token until success or all tokens fail
    let attempts = 0;
    const maxAttempts = 3; // Prevent infinite loops

    while (attempts < maxAttempts) {
      const tokenStatus = getBestToken();
      
      if (!tokenStatus) {
        return NextResponse.json({
          results: [],
          error: 'All tokens are rate limited'
        }, { status: 429 });
      }

      try {
        const response = await fetch(
          `${TWITTER_API_URL}?query=${encodeURIComponent(query)}&tweet.fields=created_at,public_metrics&expansions=author_id&user.fields=name,username,profile_image_url`,
          {
            headers: {
              'Authorization': `Bearer ${tokenStatus.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Check for rate limit headers
        const rateLimitRemaining = response.headers.get('x-rate-limit-remaining');
        const rateLimitReset = response.headers.get('x-rate-limit-reset');

        if (!response.ok) {
          if (response.status === 429 || parseInt(rateLimitRemaining || '0') === 0) {
            const resetTime = rateLimitReset ? parseInt(rateLimitReset) * 1000 : Date.now() + 900000;
            markTokenFailure(tokenStatus.token, resetTime);
            attempts++;
            continue;
          }
          throw new Error(`Twitter API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Mark token as successfully used
        markTokenSuccess(tokenStatus.token);

        return NextResponse.json({
          results: data.data || [],
          includes: data.includes,
        });

      } catch (error) {
        console.error(`Error with token attempt ${attempts + 1}:`, error);
        markTokenFailure(tokenStatus.token);
        attempts++;
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch Twitter results after multiple attempts' },
      { status: 500 }
    );

  } catch (error) {
    console.error('Twitter search error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Twitter results' },
      { status: 500 }
    );
  }
} 