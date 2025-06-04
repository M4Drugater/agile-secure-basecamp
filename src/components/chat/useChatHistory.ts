
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';
import { ChatMessage } from './types';

export type ChatConversation = Database['public']['Tables']['chat_conversations']['Row'];

export function useChatHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['chat-conversations'],
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

  const saveMessage = useCallback(async (message: ChatMessage, conversationId?: string) => {
    if (!user) return null;

    let finalConversationId = conversationId;

    // Create new conversation if none exists
    if (!finalConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: message.content.substring(0, 50) + '...',
        })
        .select()
        .single();

      if (convError) throw convError;
      finalConversationId = newConversation.id;
      setCurrentConversationId(finalConversationId);
    }

    // Save the message
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: finalConversationId,
        role: message.role,
        content: message.content,
      })
      .select()
      .single();

    if (error) throw error;

    // Update conversation message count
    await supabase.rpc('increment_message_count', {
      conversation_id: finalConversationId,
    });

    queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
    return finalConversationId;
  }, [user, queryClient]);

  const loadConversationMessages = useCallback(async (conversationId: string) => {
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

  const deleteConversation = useMutation({
    mutationFn: async (conversationId: string) => {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-conversations'] });
      setCurrentConversationId(null);
    },
  });

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    isLoading,
    saveMessage,
    loadConversationMessages,
    deleteConversation: deleteConversation.mutate,
  };
}
