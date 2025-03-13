interface TwitterMetrics {
  retweet_count: number;
  reply_count: number;
  like_count: number;
}

export interface TweetType {
  id: string;
  text: string;
  created_at: string;
  public_metrics: TwitterMetrics;
  username?: string;
}

interface TweetProps {
  tweet: TweetType;
}




import { MessageSquare, Repeat, Heart, User } from "lucide-react";

export const Tweet: React.FC<TweetProps> = ({ tweet }) => {
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