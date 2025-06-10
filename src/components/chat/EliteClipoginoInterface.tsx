
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  PanelLeftOpen, 
  PanelLeftClose, 
  User, 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp,
  Award,
  Zap,
  Crown
} from 'lucide-react';
import { useEnhancedClipoginoChat } from './useEnhancedClipoginoChat';
import { useChatHistory } from './useChatHistory';
import { useLocation } from 'react-router-dom';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';
import { ChatInput } from './ChatInput';
import { ConversationSidebar } from './ConversationSidebar';
import { ModelSelector } from './ModelSelector';
import { KnowledgeRecommendations } from './KnowledgeRecommendations';

export function EliteClipoginoInterface() {
  const location = useLocation();
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
    contextSummary
  } = useEnhancedClipoginoChat();
  
  const { setCurrentConversationId } = useChatHistory();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(true);
  const [showEliteMetrics, setShowEliteMetrics] = useState(false);
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

  const handleSendMessage = async (input: string, attachedFiles?: any[]) => {
    // Pass current page context to the chat system
    await sendMessage(input, attachedFiles, location.pathname);
  };

  const getContextQualityColor = () => {
    const totalItems = contextSummary.knowledgeCount + contextSummary.contentCount + contextSummary.learningCount;
    if (totalItems >= 15) return 'bg-emerald-500';
    if (totalItems >= 8) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getContextQualityLabel = () => {
    const totalItems = contextSummary.knowledgeCount + contextSummary.contentCount + contextSummary.learningCount;
    if (totalItems >= 15) return 'Elite';
    if (totalItems >= 8) return 'Advanced';
    return 'Developing';
  };

  const getExperienceLevel = () => {
    if (contextSummary.knowledgeCount >= 10 && contextSummary.activityCount >= 20) return 'Executive';
    if (contextSummary.knowledgeCount >= 5 && contextSummary.activityCount >= 10) return 'Senior Professional';
    return 'Emerging Leader';
  };

  return (
    <div className="space-y-6">
      {/* Elite Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CLIPOGINO Elite AI Mentor
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Award className="h-3 w-3 mr-1" />
              Elite v2.0
            </Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            Strategic AI mentoring for executive development and career acceleration
          </p>
        </div>
      </div>

      {/* Elite Context Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Alert className="border-emerald-200 bg-emerald-50/50">
          <Target className="h-4 w-4 text-emerald-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Context Quality: {getContextQualityLabel()}</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  {contextSummary.knowledgeCount} knowledge assets, {contextSummary.activityCount} interactions
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${getContextQualityColor()}`}></div>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-blue-200 bg-blue-50/50">
          <TrendingUp className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Experience Level: {getExperienceLevel()}</strong>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on engagement depth and knowledge base
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEliteMetrics(!showEliteMetrics)}
                className="text-blue-600 hover:text-blue-700"
              >
                {showEliteMetrics ? 'Hide' : 'Metrics'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>

        <Alert className="border-purple-200 bg-purple-50/50">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription>
            <div>
              <strong>Elite AI Enhancement: Active</strong>
              <p className="text-sm text-muted-foreground mt-1">
                Strategic context awareness with personalized guidance
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>

      {/* Elite Metrics Expansion */}
      {showEliteMetrics && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-emerald-600">{contextSummary.knowledgeCount}</div>
                <div className="text-sm text-muted-foreground">Knowledge Assets</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-blue-600">{contextSummary.contentCount}</div>
                <div className="text-sm text-muted-foreground">Strategic Content</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-orange-600">{contextSummary.learningCount}</div>
                <div className="text-sm text-muted-foreground">Learning Paths</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-purple-600">{contextSummary.activityCount}</div>
                <div className="text-sm text-muted-foreground">Elite Interactions</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-600">{contextSummary.conversationCount}</div>
                <div className="text-sm text-muted-foreground">Strategic Sessions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-6">
        {/* Enhanced Conversation Sidebar */}
        {showSidebar && (
          <div className="w-80 flex-shrink-0">
            <ConversationSidebar 
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
            />
          </div>
        )}

        {/* Elite Chat Interface */}
        <div className="flex-1">
          <Card className="h-[600px] flex flex-col border-gradient-to-r from-blue-200 to-purple-200">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-purple-50">
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
                  <Crown className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Elite Strategic Mentoring Session</span>
                  
                  {/* Elite Status Badges */}
                  {hasProfileContext && (
                    <Badge variant="default" className="ml-2 bg-emerald-600">
                      <User className="h-3 w-3 mr-1" />
                      Executive Profile
                    </Badge>
                  )}
                  
                  <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <Brain className="h-3 w-3 mr-1" />
                    Elite Context
                  </Badge>
                  
                  {knowledgeRecommendations.length > 0 && (
                    <Badge variant="outline" className="ml-2 border-emerald-500 text-emerald-700">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Knowledge Enhanced
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="ml-2 border-yellow-500 text-yellow-700">
                    <Zap className="h-3 w-3 mr-1" />
                    Elite AI v2.0
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
                  {messages.length === 0 && (
                    <div className="text-center py-12 space-y-4">
                      <Crown className="h-16 w-16 text-yellow-500 mx-auto" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">Welcome to Elite CLIPOGINO</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Your strategic AI mentor for executive development. I provide personalized, 
                          high-impact guidance based on your profile, knowledge base, and career goals.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          <Badge variant="secondary">Executive Coaching</Badge>
                          <Badge variant="secondary">Strategic Planning</Badge>
                          <Badge variant="secondary">Leadership Development</Badge>
                          <Badge variant="secondary">Career Acceleration</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                  
                  {isLoading && <LoadingMessage />}
                </div>
              </ScrollArea>

              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Knowledge Panel */}
        {showKnowledgePanel && knowledgeRecommendations.length > 0 && (
          <KnowledgeRecommendations
            recommendations={knowledgeRecommendations}
            onViewResource={(resource) => console.log('Elite knowledge view:', resource)}
          />
        )}
      </div>
    </div>
  );
}
