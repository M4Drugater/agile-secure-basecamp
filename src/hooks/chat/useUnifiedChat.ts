
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMessageHandling } from '@/components/chat/useMessageHandling';
import { useContextBuilder } from '@/hooks/context/useContextBuilder';
import { useConversationState } from '@/components/chat/useConversationState';
import { ChatMessage } from '@/components/chat/types';

interface AttachedFile {
  file: File;
  uploadData?: any;
  isProcessing?: boolean;
}

interface ChatOptions {
  enableEnhancedContext?: boolean;
  enableFileAttachments?: boolean;
  enableKnowledgeRecommendations?: boolean;
  currentPage?: string;
}

export function useUnifiedChat(options: ChatOptions = {}) {
  const { user } = useAuth();
  const { isLoading, selectedModel, setSelectedModel, sendMessageToAI } = useMessageHandling();
  const { buildFullContextString, getContextSummary } = useContextBuilder();
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

  const [chatState, setChatState] = useState({
    showSidebar: true,
    showKnowledgePanel: true,
    showContextDetails: false,
  });

  const contextSummary = getContextSummary();

  const sendMessage = useCallback(async (
    input: string, 
    attachedFiles?: AttachedFile[]
  ) => {
    if ((!input.trim() && (!attachedFiles || attachedFiles.length === 0)) || !user || isLoading) {
      return;
    }

    // Create message content including file information
    let messageContent = input.trim();
    
    if (options.enableFileAttachments && attachedFiles && attachedFiles.length > 0) {
      const fileDescriptions = attachedFiles
        .filter(af => af.uploadData)
        .map(af => {
          const analysis = af.uploadData.ai_analysis;
          const prefix = options.enableEnhancedContext ? 'Elite File Analysis' : 'Attached File';
          return `[${prefix}: ${af.uploadData.original_file_name}]
File Type: ${af.uploadData.file_type}
${analysis?.summary ? `Summary: ${analysis.summary}` : ''}
${af.uploadData.extracted_content ? `Content: ${af.uploadData.extracted_content.substring(0, 1000)}${af.uploadData.extracted_content.length > 1000 ? '...' : ''}` : ''}`;
        })
        .join('\n\n');

      if (fileDescriptions) {
        const sectionTitle = options.enableEnhancedContext ? 'Strategic File Analysis' : 'Attached Files';
        messageContent = messageContent 
          ? `${messageContent}\n\n--- ${sectionTitle} ---\n${fileDescriptions}`
          : `--- ${sectionTitle} ---\n${fileDescriptions}`;
      }
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    addMessage(userMessage);

    try {
      const conversationId = await saveMessageToHistory(userMessage, currentConversationId);
      
      let fullContext = '';
      if (options.enableEnhancedContext) {
        fullContext = await buildFullContextString(input);
      }

      if (options.enableKnowledgeRecommendations) {
        await updateKnowledgeRecommendations(input);
      }

      const enhancedUserMessage = {
        ...userMessage,
        metadata: {
          currentPage: options.currentPage || '/chat',
          contextQuality: options.enableEnhancedContext ? 'enhanced' : 'standard',
          attachedFilesCount: attachedFiles?.length || 0
        }
      };

      const assistantMessage = await sendMessageToAI(enhancedUserMessage, fullContext, messages);
      addMessage(assistantMessage);
      await saveMessageToHistory(assistantMessage, conversationId);

    } catch (error) {
      console.error('Error in unified sendMessage:', error);
      
      const errorTone = options.enableEnhancedContext 
        ? 'I apologize for the interruption. Let me recalibrate my systems to provide you with the strategic guidance you need.'
        : 'I encountered an error while processing your request. Please try again.';
        
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: errorTone,
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    }
  }, [
    user, 
    isLoading, 
    options, 
    addMessage, 
    saveMessageToHistory, 
    currentConversationId,
    buildFullContextString,
    updateKnowledgeRecommendations,
    sendMessageToAI,
    messages
  ]);

  const startNewConversation = useCallback(() => {
    startNewConv();
  }, [startNewConv]);

  const selectConversation = useCallback(async (conversationId: string) => {
    await selectConv(conversationId);
  }, [selectConv]);

  const updateChatState = useCallback((updates: Partial<typeof chatState>) => {
    setChatState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    // Chat state
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    
    // Chat actions
    sendMessage,
    startNewConversation,
    selectConversation,
    
    // Context information
    hasProfileContext: contextSummary.hasProfile,
    knowledgeRecommendations: knowledgeRecommendations || [],
    contextSummary,
    
    // UI state
    chatState,
    updateChatState,
  };
}
