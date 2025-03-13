interface TwitterResult {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
  };
}

export function TwitterResults({ results }: { results: TwitterResult[] }) {
  if (!results.length) return null;

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Related Tweets</h3>
      <div className="space-y-2">
        {results.map((tweet) => (
          <div 
            key={tweet.id}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
          >
            <p className="text-gray-800 dark:text-gray-200">{tweet.text}</p>
            <div className="mt-2 flex gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span>❤️ {tweet.public_metrics.like_count}</span>
              <span>🔁 {tweet.public_metrics.retweet_count}</span>
              <span>💬 {tweet.public_metrics.reply_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 