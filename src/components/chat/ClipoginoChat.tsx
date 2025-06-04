
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, PanelLeftOpen, PanelLeftClose, User, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClipoginoChat } from './useClipoginoChat';
import { useChatHistory } from './useChatHistory';
import { useProfileContext } from '@/hooks/useProfileContext';
import { ChatHeader } from './ChatHeader';
import { UsageWarning } from './UsageWarning';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';
import { ChatInput } from './ChatInput';
import { ConversationSidebar } from './ConversationSidebar';
import { ModelSelector } from './ModelSelector';
import { KnowledgeRecommendations } from './KnowledgeRecommendations';

export function ClipoginoChat() {
  const { 
    messages, 
    isLoading, 
    selectedModel, 
    setSelectedModel,
    sendMessage, 
    startNewConversation,
    selectConversation,
    hasProfileContext,
    knowledgeRecommendations
  } = useClipoginoChat();
  
  const { setCurrentConversationId } = useChatHistory();
  const profileContext = useProfileContext();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(true);
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

  const handleViewKnowledgeResource = (resource: any) => {
    // You could implement a modal or navigation to the knowledge base here
    console.log('View knowledge resource:', resource);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <ChatHeader />
      <UsageWarning />

      {/* Profile Integration Status */}
      {!profileContext && (
        <Alert>
          <User className="h-4 w-4" />
          <AlertDescription>
            Complete your profile to get personalized mentoring and advice tailored to your career goals and experience.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-6">
        {/* Conversation Sidebar */}
        {showSidebar && (
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
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="p-2"
                  >
                    {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                  </Button>
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm font-medium">Professional Development Chat</span>
                  {hasProfileContext && (
                    <Badge variant="secondary" className="ml-2">
                      <User className="h-3 w-3 mr-1" />
                      Personalized
                    </Badge>
                  )}
                  {knowledgeRecommendations.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Knowledge Enhanced
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKnowledgePanel(!showKnowledgePanel)}
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
        {showKnowledgePanel && knowledgeRecommendations.length > 0 && (
          <KnowledgeRecommendations
            recommendations={knowledgeRecommendations}
            onViewResource={handleViewKnowledgeResource}
          />
        )}
      </div>
    </div>
  );
}
