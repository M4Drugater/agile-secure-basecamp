import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, PanelLeftOpen, PanelLeftClose, User, BookOpen, Zap, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUnifiedChat } from '@/hooks/chat/useUnifiedChat';
import { useChatHistory } from './useChatHistory';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';
import { ChatInput } from './ChatInput';
import { ConversationSidebar } from './ConversationSidebar';
import { ModelSelector } from './ModelSelector';
import { KnowledgeRecommendations } from './KnowledgeRecommendations';

export interface ChatInterfaceConfig {
  title?: string;
  subtitle?: string;
  enableEnhancedContext?: boolean;
  enableFileAttachments?: boolean;
  enableKnowledgeRecommendations?: boolean;
  showContextStatus?: boolean;
  currentPage?: string;
  customBadges?: Array<{
    label: string;
    variant: 'default' | 'secondary' | 'outline';
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

interface UnifiedChatInterfaceProps {
  config: ChatInterfaceConfig;
  onViewKnowledgeResource?: (resource: any) => void;
}

export function UnifiedChatInterface({ 
  config, 
  onViewKnowledgeResource 
}: UnifiedChatInterfaceProps) {
  const {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    startNewConversation,
    selectConversation,
    hasProfileContext,
    knowledgeRecommendations,
    contextSummary,
    chatState,
    updateChatState,
  } = useUnifiedChat({
    enableEnhancedContext: config.enableEnhancedContext,
    enableFileAttachments: config.enableFileAttachments,
    enableKnowledgeRecommendations: config.enableKnowledgeRecommendations,
    currentPage: config.currentPage,
  });

  const { setCurrentConversationId } = useChatHistory();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    startNewConversation();
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    selectConversation(conversationId);
  };

  const getContextQualityColor = () => {
    if (contextSummary.quality === 'excellent') return 'bg-green-500';
    if (contextSummary.quality === 'good') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex gap-6">
      {/* Conversation Sidebar */}
      {chatState.showSidebar && (
        <div className="w-80 flex-shrink-0">
          <ConversationSidebar 
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateChatState({ showSidebar: !chatState.showSidebar })}
                  className="p-2"
                >
                  {chatState.showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </Button>
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {config.title || 'AI Chat with CLIPOGINO'}
                </span>
                
                {/* Dynamic Badges */}
                {hasProfileContext && (
                  <Badge variant="default" className="ml-2">
                    <User className="h-3 w-3 mr-1" />
                    Personalized
                  </Badge>
                )}
                
                {config.enableEnhancedContext && (
                  <Badge variant="secondary" className="ml-2">
                    <Brain className="h-3 w-3 mr-1" />
                    Context: {contextSummary.quality || 'Standard'}
                  </Badge>
                )}
                
                {knowledgeRecommendations.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Knowledge Enhanced
                  </Badge>
                )}
                
                {config.customBadges?.map((badge, index) => (
                  <Badge key={index} variant={badge.variant} className="ml-2">
                    {badge.icon && <badge.icon className="h-3 w-3 mr-1" />}
                    {badge.label}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateChatState({ showKnowledgePanel: !chatState.showKnowledgePanel })}
                  className="p-2"
                >
                  <BookOpen className="h-4 w-4" />
                </Button>
                <div className="w-64">
                  <ModelSelector 
                    selectedModel={selectedModel}
                    onModelChange={(model) => setSelectedModel(model as 'gpt-4o-mini' | 'gpt-4o')}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col space-y-4">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && <WelcomeMessage />}
                
                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} />
                ))}
                
                {isLoading && <LoadingMessage />}
              </div>
            </ScrollArea>

            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Recommendations Panel */}
      {chatState.showKnowledgePanel && knowledgeRecommendations.length > 0 && (
        <KnowledgeRecommendations
          recommendations={knowledgeRecommendations}
          onViewResource={onViewKnowledgeResource || (() => {})}
        />
      )}
    </div>
  );
}
