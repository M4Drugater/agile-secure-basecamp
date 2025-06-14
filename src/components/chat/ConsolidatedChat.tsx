import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, PanelLeftOpen, PanelLeftClose, User, BookOpen, Zap, Brain, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useMessageHandling } from './useMessageHandling';
import { useConversationState } from './useConversationState';
import { useChatHistory } from './useChatHistory';
import { useConsolidatedContext } from '@/hooks/useConsolidatedContext';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { ChatHeader } from './ChatHeader';
import { UsageWarning } from './UsageWarning';
import { WelcomeMessage } from './WelcomeMessage';
import { ChatMessage } from './ChatMessage';
import { LoadingMessage } from './LoadingMessage';
import { ChatInput } from './ChatInput';
import { ConversationSidebar } from './ConversationSidebar';
import { ModelSelector } from './ModelSelector';
import { KnowledgeRecommendations } from './KnowledgeRecommendations';
import { ChatPromptSuggestion } from './ChatPromptSuggestion';
import { ChatMessage as ChatMessageType } from './types';

interface AttachedFile {
  file: File;
  uploadData?: any;
  isProcessing?: boolean;
}

export function ConsolidatedChat() {
  const { user } = useAuth();
  const { isLoading, selectedModel, setSelectedModel, sendMessageToAI } = useMessageHandling();
  const { buildFullContextString, getContextSummary, hasProfileContext } = useConsolidatedContext();
  const { getJourneySteps, completeStep, isInitialized } = useProgressiveJourney();
  const { documents } = useKnowledgeBase();
  const {
    messages,
    knowledgeRecommendations,
    currentConversationId,
    addMessage,
    saveMessageToHistory,
    updateKnowledgeRecommendations,
    startNewConversation: startNewConv,
    selectConversation: selectConv,
  } = useConversationState();
  
  const { setCurrentConversationId } = useChatHistory();
  const contextSummary = getContextSummary();
  
  const [showSidebar, setShowSidebar] = useState(true);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(true);
  const [showContextDetails, setShowContextDetails] = useState(false);
  const [hasChatStepCompleted, setHasChatStepCompleted] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Check if chat step is completed
  const journeySteps = getJourneySteps();
  const chatStep = journeySteps.find(step => step.id === 'chat');
  const hasCompletedChat = chatStep?.completed || false;
  const hasKnowledgeFiles = (documents && documents.length > 0) || false;

  console.log('ConsolidatedChat - Journey Debug:', {
    chatStepCompleted: hasCompletedChat,
    messagesCount: messages.length,
    hasChatStepCompleted,
    isInitialized,
    chatStep: chatStep ? { id: chatStep.id, completed: chatStep.completed } : null
  });

  // Auto-complete chat step after successful conversation
  useEffect(() => {
    if (!isInitialized) {
      console.log('Journey not initialized yet, skipping chat completion check');
      return;
    }

    // Check if we have a successful conversation (user message + AI response)
    const hasUserMessage = messages.some(m => m.role === 'user');
    const hasAssistantMessage = messages.some(m => m.role === 'assistant');
    const shouldCompleteChat = hasUserMessage && hasAssistantMessage && messages.length >= 2;

    console.log('Chat step completion check:', {
      hasUserMessage,
      hasAssistantMessage,
      messagesLength: messages.length,
      shouldCompleteChat,
      hasCompletedChat,
      hasChatStepCompleted,
      isInitialized
    });

    if (shouldCompleteChat && !hasCompletedChat && !hasChatStepCompleted) {
      console.log('Auto-completing chat step...');
      setHasChatStepCompleted(true);
      completeStep('chat');
    }
  }, [messages, hasCompletedChat, hasChatStepCompleted, completeStep, isInitialized]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (input: string, attachedFiles?: AttachedFile[]) => {
    if ((!input.trim() && (!attachedFiles || attachedFiles.length === 0)) || !user || isLoading) return;

    // Create message content including file information
    let messageContent = input.trim();
    
    if (attachedFiles && attachedFiles.length > 0) {
      const fileDescriptions = attachedFiles
        .filter(af => af.uploadData)
        .map(af => {
          const analysis = af.uploadData.ai_analysis;
          return `[Attached File: ${af.uploadData.original_file_name}]
File Type: ${af.uploadData.file_type}
${analysis?.summary ? `Summary: ${analysis.summary}` : ''}
${af.uploadData.extracted_content ? `Content: ${af.uploadData.extracted_content.substring(0, 1000)}${af.uploadData.extracted_content.length > 1000 ? '...' : ''}` : ''}`;
        })
        .join('\n\n');

      if (fileDescriptions) {
        messageContent = messageContent 
          ? `${messageContent}\n\n--- Attached Files ---\n${fileDescriptions}`
          : `--- Attached Files ---\n${fileDescriptions}`;
      }
    }

    const userMessage: ChatMessageType = {
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    addMessage(userMessage);

    try {
      // Save user message to database and get conversation ID
      const conversationId = await saveMessageToHistory(userMessage, currentConversationId);
      
      // Build full context using consolidated context builder
      const fullContext = await buildFullContextString(input);
      
      // Update knowledge recommendations
      await updateKnowledgeRecommendations(input);
      
      // Send message to AI and get response
      const assistantMessage = await sendMessageToAI(userMessage, fullContext, messages);
      
      // Add assistant message to UI
      addMessage(assistantMessage);
      
      // Save assistant message to database
      await saveMessageToHistory(assistantMessage, conversationId);

      console.log('Chat interaction completed successfully');

    } catch (error) {
      console.error('Error in sendMessage:', error);
    }
  };

  const handleUseSuggestedPrompt = (prompt: string) => {
    sendMessage(prompt);
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    startNewConv();
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    selectConv(conversationId);
  };

  const handleViewKnowledgeResource = (resource: any) => {
    console.log('View knowledge resource:', resource);
  };

  const getContextQualityColor = () => {
    if (contextSummary.quality === 'excellent') return 'bg-green-500';
    if (contextSummary.quality === 'good') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Context Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Alert className="border-blue-200 bg-blue-50/50">
          <Brain className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Context Quality: {contextSummary.quality}</strong>
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
                  Enhanced context with {contextSummary.conversationCount} recent conversations
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
        <div className="flex-1 space-y-4">
          {/* Prompt Suggestion - only show if chat step not completed and no messages */}
          {!hasCompletedChat && messages.length === 0 && (
            <ChatPromptSuggestion 
              onUseSuggestion={handleUseSuggestedPrompt}
              hasKnowledgeFiles={hasKnowledgeFiles}
            />
          )}

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
                  <span className="text-sm font-medium">Consolidated AI Chat</span>
                  
                  {hasProfileContext && (
                    <Badge variant="default" className="ml-2">
                      <User className="h-3 w-3 mr-1" />
                      Personalized
                    </Badge>
                  )}
                  
                  <Badge variant="secondary" className="ml-2">
                    <Brain className="h-3 w-3 mr-1" />
                    Context: {contextSummary.quality}
                  </Badge>
                  
                  {knowledgeRecommendations?.length > 0 && (
                    <Badge variant="outline" className="ml-2">
                      <BookOpen className="h-3 w-3 mr-1" />
                      Knowledge Enhanced
                    </Badge>
                  )}
                  
                  <Badge variant="outline" className="ml-2">
                    <Zap className="h-3 w-3 mr-1" />
                    Optimized v2.0
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

        {/* Knowledge Recommendations Panel */}
        {showKnowledgePanel && knowledgeRecommendations?.length > 0 && (
          <KnowledgeRecommendations
            recommendations={knowledgeRecommendations}
            onViewResource={handleViewKnowledgeResource}
          />
        )}
      </div>
    </div>
  );
}
