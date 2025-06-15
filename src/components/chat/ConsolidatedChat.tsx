import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageSquare, PanelLeftOpen, PanelLeftClose, User, BookOpen, Zap, Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useMessageHandling } from './useMessageHandling';
import { useConversationState } from './useConversationState';
import { useChatHistory } from './useChatHistory';
import { useConsolidatedContext } from '@/hooks/useConsolidatedContext';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { ChatContextStatus } from './ChatContextStatus';
import { ChatContextDetails } from './ChatContextDetails';
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

  // Auto-complete chat step after successful conversation
  useEffect(() => {
    if (!isInitialized) return;

    const hasUserMessage = messages.some(m => m.role === 'user');
    const hasAssistantMessage = messages.some(m => m.role === 'assistant');
    const shouldCompleteChat = hasUserMessage && hasAssistantMessage && messages.length >= 2;

    if (shouldCompleteChat && !hasCompletedChat && !hasChatStepCompleted) {
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

    addMessage(userMessage);

    try {
      const conversationId = await saveMessageToHistory(userMessage, currentConversationId);
      const fullContext = await buildFullContextString(input);
      await updateKnowledgeRecommendations(input);
      const assistantMessage = await sendMessageToAI(userMessage, fullContext, messages);
      addMessage(assistantMessage);
      await saveMessageToHistory(assistantMessage, conversationId);
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

  return (
    <div className="space-y-6">
      <ChatContextStatus 
        contextSummary={contextSummary}
        showContextDetails={showContextDetails}
        setShowContextDetails={setShowContextDetails}
      />

      {showContextDetails && (
        <ChatContextDetails contextSummary={contextSummary} />
      )}

      <div className="flex gap-6">
        {showSidebar && (
          <div className="w-80 flex-shrink-0">
            <ConversationSidebar 
              onSelectConversation={(id) => {
                setCurrentConversationId(id);
                selectConv(id);
              }}
              onNewConversation={() => {
                setCurrentConversationId(null);
                startNewConv();
              }}
            />
          </div>
        )}

        <div className="flex-1 space-y-4">
          {!hasCompletedChat && messages.length === 0 && (
            <ChatPromptSuggestion 
              onUseSuggestion={sendMessage}
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

        {showKnowledgePanel && knowledgeRecommendations?.length > 0 && (
          <KnowledgeRecommendations
            recommendations={knowledgeRecommendations}
            onViewResource={(resource) => console.log('View knowledge resource:', resource)}
          />
        )}
      </div>
    </div>
  );
}
