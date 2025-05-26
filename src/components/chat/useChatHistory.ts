
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { ChatMessage } from './types';

export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export function useChatHistory() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load conversations list
  const loadConversations = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!error && data) {
        setConversations(data);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a conversation
  const loadConversationMessages = async (conversationId: string): Promise<ChatMessage[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        return data.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    
    return [];
  };

  // Save a message to current conversation
  const saveMessage = async (message: ChatMessage, conversationId?: string) => {
    if (!user) return null;

    let activeConversationId = conversationId || currentConversationId;

    // Create new conversation if none exists
    if (!activeConversationId) {
      const title = message.role === 'user' 
        ? message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '')
        : 'New Conversation';

      const { data: newConv, error: convError } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title,
          message_count: 0
        })
        .select()
        .single();

      if (convError || !newConv) {
        console.error('Error creating conversation:', convError);
        return null;
      }

      activeConversationId = newConv.id;
      setCurrentConversationId(activeConversationId);
      await loadConversations(); // Refresh list
    }

    // Save the message
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: activeConversationId,
          role: message.role,
          content: message.content
        });

      if (!error) {
        // Update conversation message count and timestamp
        await supabase
          .from('chat_conversations')
          .update({ 
            updated_at: new Date().toISOString(),
            message_count: supabase.rpc('increment_message_count', { 
              conversation_id: activeConversationId 
            })
          })
          .eq('id', activeConversationId);
      }

      return activeConversationId;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  // Delete a conversation
  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user?.id);

      if (!error) {
        await loadConversations();
        if (currentConversationId === conversationId) {
          setCurrentConversationId(null);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  return {
    conversations,
    currentConversationId,
    isLoading,
    loadConversations,
    loadConversationMessages,
    saveMessage,
    deleteConversation,
    setCurrentConversationId
  };
}
