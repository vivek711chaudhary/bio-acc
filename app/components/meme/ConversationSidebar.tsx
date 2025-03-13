import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

interface StoredConversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: number;
}


interface ConversationSidebarProps {
  conversations: StoredConversation[];
  currentConversationId: string;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation
}) => {
  const formatDate = (timestamp: number) => {
    return format(timestamp, 'MMM d, yyyy');
  };

  return (
    <div className="w-72 border-r border-secondary/20 bg-background/95 overflow-y-auto">
      <div className="p-4">
        <Button 
          onClick={onNewConversation}
          className="w-full mb-4"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Meme Analysis
        </Button>
        
        <div className="space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg transition-colors",
                "hover:bg-secondary/50 relative group",
                currentConversationId === conv.id 
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground/80"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{conv.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conv.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              {conv.lastMessage && (
                <p className="text-xs text-foreground/60 truncate mt-1">
                  {conv.lastMessage}
                </p>
              )}
              <time className="text-xs text-foreground/40 absolute bottom-2 right-3">
                {formatDate(conv.timestamp)}
              </time>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 