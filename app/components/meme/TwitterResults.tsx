import { TweetType ,Tweet} from './Tweet';
import { Loader2, AlertCircle, Twitter } from 'lucide-react';


interface TwitterResultsProps {
  results: TweetType[];
  isLoading: boolean;
  hashtag: string;
}

export const TwitterResults: React.FC<TwitterResultsProps> = ({ 
  results, 
  isLoading, 
  hashtag 
}) => {
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