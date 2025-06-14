
import { useAuth } from '@/contexts/AuthContext';
import { useMessageHandling } from './useMessageHandling';
import { useEnhancedContextBuilder } from '@/hooks/useEnhancedContextBuilder';
import { useConversationState } from './useConversationState';
import { ChatMessage } from './types';

interface AttachedFile {
  file: File;
  uploadData?: any;
  isProcessing?: boolean;
}

export function useEnhancedClipoginoChat() {
  const { user } = useAuth();
  const { isLoading, selectedModel, setSelectedModel, sendMessageToAI } = useMessageHandling();
  const { buildFullContextString, getContextSummary } = useEnhancedContextBuilder();
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

  const sendMessage = async (input: string, attachedFiles?: AttachedFile[], currentPage?: string) => {
    if ((!input.trim() && (!attachedFiles || attachedFiles.length === 0)) || !user || isLoading) return;

    // Create enhanced message content including file information
    let messageContent = input.trim();
    
    if (attachedFiles && attachedFiles.length > 0) {
      const fileDescriptions = attachedFiles
        .filter(af => af.uploadData)
        .map(af => {
          const analysis = af.uploadData.ai_analysis;
          return `[Elite File Analysis: ${af.uploadData.original_file_name}]
File Type: ${af.uploadData.file_type}
Strategic Summary: ${analysis?.summary || 'Processing...'}
Key Business Insights: ${analysis?.key_points?.join('; ') || 'Analyzing...'}
Content Extract: ${af.uploadData.extracted_content?.substring(0, 1000)}${af.uploadData.extracted_content?.length > 1000 ? '...' : ''}`;
        })
        .join('\n\n');

      if (fileDescriptions) {
        messageContent = messageContent 
          ? `${messageContent}\n\n--- Strategic File Analysis ---\n${fileDescriptions}`
          : `--- Strategic File Analysis ---\n${fileDescriptions}`;
      }
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    // Add user message to UI immediately
    addMessage(userMessage);

    try {
      // Save user message to database and get conversation ID
      const conversationId = await saveMessageToHistory(userMessage, currentConversationId);
      
      // Build elite enhanced context
      let fullContext = await buildFullContextString(input);
      
      // Add file context if available
      if (attachedFiles && attachedFiles.length > 0) {
        const fileContext = attachedFiles
          .filter(af => af.uploadData)
          .map(af => {
            const analysis = af.uploadData.ai_analysis;
            return `ELITE FILE INTELLIGENCE:
- Strategic Document: ${af.uploadData.original_file_name}
- Business Classification: ${af.uploadData.file_type}
- Executive Summary: ${analysis?.summary || 'Elite analysis in progress'}
- Strategic Insights: ${analysis?.key_points?.join('; ') || 'Developing strategic insights'}
- Business Content: ${af.uploadData.extracted_content?.substring(0, 2000) || 'Content extraction in progress'}`;
          })
          .join('\n\n');

        if (fileContext) {
          fullContext += `\n\n=== ELITE FILE INTELLIGENCE ===\n${fileContext}`;
        }
      }
      
      // Update knowledge recommendations
      await updateKnowledgeRecommendations(input);
      
      // Send enhanced message to Elite AI with page context
      const enhancedUserMessage = {
        ...userMessage,
        content: messageContent,
        metadata: {
          currentPage: currentPage || '/chat',
          contextQuality: 'elite',
          attachedFilesCount: attachedFiles?.length || 0
        }
      };
      
      const assistantMessage = await sendMessageToAI(enhancedUserMessage, fullContext, messages);
      
      // Add assistant message to UI
      addMessage(assistantMessage);
      
      // Save assistant message to database
      await saveMessageToHistory(assistantMessage, conversationId);

    } catch (error) {
      console.error('Error in elite enhanced sendMessage:', error);
      // Add error message with elite tone
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'I apologize for the interruption. Let me recalibrate my systems to provide you with the strategic guidance you need. Please try your request again, and I will deliver the executive-level insights you expect.',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    }
  };

  const startNewConversation = () => {
    startNewConv();
  };

  const selectConversation = async (conversationId: string) => {
    await selectConv(conversationId);
  };

  const contextSummary = getContextSummary();

  return {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    startNewConversation,
    selectConversation,
    hasProfileContext: contextSummary.hasProfile,
    knowledgeRecommendations: knowledgeRecommendations || [],
    contextSummary,
  };
}
