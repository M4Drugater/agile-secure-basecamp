
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Plus, Trash2, Calendar } from 'lucide-react';
import { useChatHistory, ChatConversation } from './history';
import { formatDistanceToNow } from 'date-fns';

interface ConversationSidebarProps {
  onSelectConversation: (conversationId: string) => void;
  onNewConversation: () => void;
}

export function ConversationSidebar({ onSelectConversation, onNewConversation }: ConversationSidebarProps) {
  const { 
    conversations, 
    currentConversationId, 
    isLoading, 
    deleteConversation 
  } = useChatHistory();

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation();
    if (confirm('Delete this conversation? This action cannot be undone.')) {
      await deleteConversation(conversationId);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Chat History</CardTitle>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onNewConversation}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px] px-3">
          {isLoading ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-4">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              No conversations yet
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                    currentConversationId === conversation.id
                      ? 'bg-primary/10 border border-primary/20'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate mb-1">
                        {conversation.title}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {conversation.message_count} messages
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
