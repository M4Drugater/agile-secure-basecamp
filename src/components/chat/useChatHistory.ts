
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganizations } from '@/hooks/useOrganizations';
import { ChatMessage } from './types';

export function useChatHistory() {
  const { user } = useAuth();
  const { currentOrganization } = useOrganizations();
  const queryClient = useQueryClient();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  // Load conversations for current user
  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user?.id!)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Load messages for a specific conversation
  const loadConversationMessages = useCallback(async (conversationId: string): Promise<ChatMessage[]> => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.created_at),
    }));
  }, []);

  // Create new conversation
  const createConversation = useMutation({
    mutationFn: async (title: string) => {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          title,
          user_id: user?.id!,
          organization_id: currentOrganization?.id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  // Save message to database
  const saveMessage = async (message: ChatMessage, conversationId?: string): Promise<string> => {
    let convId = conversationId;

    // Create new conversation if none exists
    if (!convId) {
      const title = message.content.length > 50 
        ? message.content.substring(0, 50) + '...'
        : message.content;
      
      const conversation = await createConversation.mutateAsync(title);
      convId = conversation.id;
      setCurrentConversationId(convId);
    }

    // Save the message
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: convId,
        role: message.role,
        content: message.content,
      });

    if (error) throw error;

    // Update conversation message count and timestamp
    await supabase.rpc('increment_message_count', { conversation_id: convId });

    return convId;
  };

  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
  };

  return {
    conversations,
    currentConversationId,
    saveMessage,
    loadConversationMessages,
    selectConversation,
    startNewConversation,
  };
}
