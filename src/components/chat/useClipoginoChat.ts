
import { useAuth } from '@/contexts/AuthContext';
import { useMessageHandling } from './useMessageHandling';
import { useContextBuilder } from './useContextBuilder';
import { useConversationState } from './useConversationState';
import { ChatMessage } from './types';

interface AttachedFile {
  file: File;
  uploadData?: any;
  isProcessing?: boolean;
}

export function useClipoginoChat() {
  const { user } = useAuth();
  const { isLoading, selectedModel, setSelectedModel, sendMessageToAI } = useMessageHandling();
  const { buildFullContext, hasProfileContext } = useContextBuilder();
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
      
      // Build full context (profile + knowledge + file attachments)
      let fullContext = await buildFullContext(input);
      
      // Add file context if available
      if (attachedFiles && attachedFiles.length > 0) {
        const fileContext = attachedFiles
          .filter(af => af.uploadData)
          .map(af => {
            const analysis = af.uploadData.ai_analysis;
            return `FILE ATTACHMENT CONTEXT:
- File: ${af.uploadData.original_file_name}
- Type: ${af.uploadData.file_type}
- Summary: ${analysis?.summary || 'No summary available'}
- Key Points: ${analysis?.key_points?.join(', ') || 'None identified'}
- Content: ${af.uploadData.extracted_content?.substring(0, 2000) || 'Content not extracted'}`;
          })
          .join('\n\n');

        if (fileContext) {
          fullContext += `\n\n=== FILE ATTACHMENTS ===\n${fileContext}`;
        }
      }
      
      // Update knowledge recommendations for the sidebar
      await updateKnowledgeRecommendations(input);
      
      // Send message to AI and get response
      const assistantMessage = await sendMessageToAI(userMessage, fullContext, messages);
      
      // Add assistant message to UI
      addMessage(assistantMessage);
      
      // Save assistant message to database
      await saveMessageToHistory(assistantMessage, conversationId);

    } catch (error) {
      console.error('Error in sendMessage:', error);
      // Error handling is done in sendMessageToAI
    }
  };

  const startNewConversation = () => {
    startNewConv();
  };

  const selectConversation = async (conversationId: string) => {
    await selectConv(conversationId);
  };

  return {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    startNewConversation,
    selectConversation,
    hasProfileContext,
    knowledgeRecommendations,
  };
}
