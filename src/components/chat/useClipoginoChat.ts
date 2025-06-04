
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCostMonitoring } from '@/hooks/useCostMonitoring';
import { useToast } from '@/hooks/use-toast';
import { useChatHistory } from './useChatHistory';
import { useProfileContext } from '@/hooks/useProfileContext';
import { useKnowledgeContext } from '@/hooks/useKnowledgeContext';
import { ChatMessage, ChatResponse } from './types';

export function useClipoginoChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { checkBeforeAction, refreshUsage } = useCostMonitoring();
  const { saveMessage, currentConversationId, loadConversationMessages } = useChatHistory();
  const profileContext = useProfileContext();
  const { buildKnowledgeContext, getKnowledgeRecommendations } = useKnowledgeContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<'gpt-4o-mini' | 'gpt-4o'>('gpt-4o-mini');
  const [knowledgeRecommendations, setKnowledgeRecommendations] = useState<any[]>([]);

  // Load conversation when conversation ID changes
  useEffect(() => {
    const loadMessages = async () => {
      if (currentConversationId) {
        try {
          const loadedMessages = await loadConversationMessages(currentConversationId);
          setMessages(loadedMessages);
        } catch (error) {
          console.error('Error loading conversation messages:', error);
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };

    loadMessages();
  }, [currentConversationId, loadConversationMessages]);

  const sendMessage = async (input: string) => {
    if (!input.trim() || !user || isLoading) return;

    // Estimate cost based on model
    const estimatedCost = selectedModel === 'gpt-4o' ? 0.05 : 0.01;
    
    // Check cost limits before proceeding
    if (!checkBeforeAction(estimatedCost)) {
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Save user message to database
      const conversationId = await saveMessage(userMessage, currentConversationId);
      
      // Build knowledge context from all three tiers
      const knowledgeContext = await buildKnowledgeContext(userMessage.content);
      
      // Get knowledge recommendations for the sidebar
      const recommendations = await getKnowledgeRecommendations(userMessage.content);
      setKnowledgeRecommendations(recommendations);
      
      // Build profile context string from profile data
      let fullContext = '';
      if (profileContext.data) {
        const profile = profileContext.data;
        fullContext = `User Profile Context:
- Name: ${profile.full_name || 'Not specified'}
- Position: ${profile.current_position || 'Not specified'}
- Company: ${profile.company || 'Not specified'}
- Industry: ${profile.industry || 'Not specified'}
- Experience Level: ${profile.experience_level || 'Not specified'}
- Years of Experience: ${profile.years_of_experience || 'Not specified'}
- Management Level: ${profile.management_level || 'Not specified'}
- Team Size: ${profile.team_size || 'Not specified'}
- Leadership Experience: ${profile.leadership_experience ? 'Yes' : 'No'}
- Target Position: ${profile.target_position || 'Not specified'}
- Target Industry: ${profile.target_industry || 'Not specified'}
- Target Salary Range: ${profile.target_salary_range || 'Not specified'}
- Learning Style: ${profile.learning_style || 'Not specified'}
- Communication Style: ${profile.communication_style || 'Not specified'}
- Feedback Preference: ${profile.feedback_preference || 'Not specified'}
- Work Environment: ${profile.work_environment || 'Not specified'}
- Career Goals: ${profile.career_goals?.join(', ') || 'Not specified'}
- Current Skills: ${profile.current_skills?.join(', ') || 'Not specified'}
- Skill Gaps: ${profile.skill_gaps?.join(', ') || 'Not specified'}
- Learning Priorities: ${profile.learning_priorities?.join(', ') || 'Not specified'}
- Certifications: ${profile.certifications?.join(', ') || 'Not specified'}

`;
      }
      
      // Add knowledge context if available
      if (knowledgeContext) {
        fullContext += knowledgeContext;
      }
      
      console.log('Sending message to CLIPOGINO with enhanced context:', {
        messageLength: userMessage.content.length,
        historyLength: messages.length,
        hasProfileContext: !!profileContext.data,
        hasKnowledgeContext: !!knowledgeContext,
        knowledgeContextLength: knowledgeContext.length,
        recommendationsCount: recommendations.length,
        model: selectedModel
      });

      const { data, error } = await supabase.functions.invoke('clipogino-chat', {
        body: {
          message: userMessage.content,
          context: fullContext,
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
          model: selectedModel,
        },
      });

      if (error) {
        throw error;
      }

      const response = data as ChatResponse;
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Save assistant message to database
      await saveMessage(assistantMessage, conversationId);
      
      // Refresh usage after successful request
      await refreshUsage();

      const contextInfo = [];
      if (profileContext.data) contextInfo.push('personalization');
      if (knowledgeContext) contextInfo.push('knowledge context');
      
      toast({
        title: 'CLIPOGINO Response',
        description: `Used ${response.usage.totalTokens} tokens (${response.model})${contextInfo.length > 0 ? ` with ${contextInfo.join(' & ')}` : ''}`,
        variant: 'default',
      });

    } catch (error: any) {
      console.error('Chat error:', error);
      
      let errorMessage = 'Failed to get response from CLIPOGINO';
      if (error.message?.includes('Usage limit reached')) {
        errorMessage = 'You have reached your daily AI usage limit';
      } else if (error.message?.includes('Cost limit exceeded')) {
        errorMessage = 'Request would exceed your usage limits';
      }

      toast({
        title: 'Chat Error',
        description: errorMessage,
        variant: 'destructive',
      });

      // Add error message to chat
      const errorChatMessage: ChatMessage = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again later.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setKnowledgeRecommendations([]);
  };

  const selectConversation = async (conversationId: string) => {
    try {
      const loadedMessages = await loadConversationMessages(conversationId);
      setMessages(loadedMessages);
      setKnowledgeRecommendations([]);
    } catch (error) {
      console.error('Error selecting conversation:', error);
      setMessages([]);
      setKnowledgeRecommendations([]);
    }
  };

  return {
    messages,
    isLoading,
    selectedModel,
    setSelectedModel,
    sendMessage,
    startNewConversation,
    selectConversation,
    hasProfileContext: !!profileContext.data,
    knowledgeRecommendations,
  };
}
