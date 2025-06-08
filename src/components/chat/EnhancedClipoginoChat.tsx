
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, PanelLeftOpen, PanelLeftClose, User, BookOpen, Zap, Brain, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useClipoginoChat } from './useClipoginoChat';
import { useChatHistory } from './useChatHistory';
import { useEnhancedContextBuilder } from '@/hooks/useEnhancedContextBuilder';
import { ChatHeader } from './ChatHeader';
import { UsageWarning } from './UsageWarning';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';
import { ChatInput } from './ChatInput';
import { ConversationSidebar } from './ConversationSidebar';
import { ModelSelector } from './ModelSelector';
import { KnowledgeRecommendations } from './KnowledgeRecommendations';

export function EnhancedClipoginoChat() {
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
  const { getContextSummary } = useEnhancedContextBuilder();
  const contextSummary = getContextSummary();
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(true);
  const [showContextDetails, setShowContextDetails] = useState(false);
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
    console.log('View knowledge resource:', resource);
  };

  const getContextQualityColor = () => {
    const totalItems = contextSummary.knowledgeCount + contextSummary.contentCount + contextSummary.learningCount;
    if (totalItems >= 10) return 'bg-green-500';
    if (totalItems >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getContextQualityLabel = () => {
    const totalItems = contextSummary.knowledgeCount + contextSummary.contentCount + contextSummary.learningCount;
    if (totalItems >= 10) return 'Excellent';
    if (totalItems >= 5) return 'Good';
    return 'Basic';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <ChatHeader />
      <UsageWarning />

      {/* Enhanced Context Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className="border-blue-200 bg-blue-50/50">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Context Quality: {getContextQualityLabel()}</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  CLIPOGINO has access to {contextSummary.knowledgeCount} knowledge items, 
                  {contextSummary.contentCount} content pieces, and {contextSummary.activityCount} recent activities.
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getContextQualityColor()}`}></div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-purple-200 bg-purple-50/50">
          <Activity className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>AI Enhancement: Active</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Enhanced context building with {contextSummary.conversationCount} recent conversations
                  and comprehensive activity tracking.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContextDetails(!showContextDetails)}
                className="text-purple-600 hover:text-purple-700"
              >
                {showContextDetails ? 'Hide' : 'Details'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Context Details Expansion */}
      {showContextDetails && (
        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">{contextSummary.knowledgeCount}</div>
                <div className="text-sm text-muted-foreground">Knowledge Items</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-600">{contextSummary.contentCount}</div>
                <div className="text-sm text-muted-foreground">Content Created</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">{contextSummary.learningCount}</div>
                <div className="text-sm text-muted-foreground">Learning Paths</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">{contextSummary.activityCount}</div>
                <div className="text-sm text-muted-foreground">Recent Activities</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">{contextSummary.conversationCount}</div>
                <div className="text-sm text-muted-foreground">Conversations</div>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  <span className="text-sm font-medium">Enhanced AI Chat with CLIPOGINO</span>
                  
                  {/* Enhanced Status Badges */}
                  {hasProfileContext && (
                    <Badge variant="default" className="ml-2">
                      <User className="h-3 w-3 mr-1" />
                      Personalized
                    </Badge>
                  )}
                  
                  <Badge variant="secondary" className="ml-2">
                    <Brain className="h-3 w-3 mr-1" />
                    Context: {getContextQualityLabel()}
                  </Badge>
                  
                  {knowledgeRecommendations.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Knowledge Enhanced
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="ml-2">
                    <Zap className="h-3 w-3 mr-1" />
                    Enhanced v2.0
                  </Badge>
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

        {/* Enhanced Knowledge Recommendations Panel */}
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
