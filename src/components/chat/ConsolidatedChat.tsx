
import React from 'react';
import { useChatConfiguration } from '@/hooks/chat/useChatConfiguration';
import { useConsolidatedContext } from '@/hooks/useConsolidatedContext';
import { useProgressiveJourney } from '@/hooks/useProgressiveJourney';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { UnifiedChatInterface } from './UnifiedChatInterface';
import { ChatContextStatus } from './ChatContextStatus';
import { ChatContextDetails } from './ChatContextDetails';
import { ChatPromptSuggestion } from './ChatPromptSuggestion';

export function ConsolidatedChat() {
  const { getPreset } = useChatConfiguration();
  const { getContextSummary } = useConsolidatedContext();
  const { getJourneySteps, completeStep, isInitialized } = useProgressiveJourney();
  const { documents } = useKnowledgeBase();
  
  const [showContextDetails, setShowContextDetails] = React.useState(false);
  const [hasChatStepCompleted, setHasChatStepCompleted] = React.useState(false);
  
  // Use consolidated chat configuration
  const chatConfig = getPreset('consolidated')!.config;
  const contextSummary = getContextSummary();

  // Check if chat step is completed
  const journeySteps = getJourneySteps();
  const chatStep = journeySteps.find(step => step.id === 'chat');
  const hasCompletedChat = chatStep?.completed || false;
  const hasKnowledgeFiles = (documents && documents.length > 0) || false;

  const handleUseSuggestedPrompt = (prompt: string) => {
    // This will be handled by the UnifiedChatInterface
    console.log('Using suggested prompt:', prompt);
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

      <div className="space-y-4">
        {!hasCompletedChat && (
          <ChatPromptSuggestion 
            onUseSuggestion={handleUseSuggestedPrompt}
            hasKnowledgeFiles={hasKnowledgeFiles}
          />
        )}

        <UnifiedChatInterface
          config={chatConfig}
          onViewKnowledgeResource={handleViewKnowledgeResource}
        />
      </div>
    </div>
  );
}
