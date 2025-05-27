
import { supabase } from '@/integrations/supabase/client';
import { ChatConversation } from './types';

export class ConversationsService {
  static async loadUserConversations(userId: string): Promise<ChatConversation[]> {
    console.log('Loading conversations for user:', userId);
    
    try {
      // Try using the edge function first
      const { data: functionData, error: functionError } = await supabase.functions.invoke('get-user-conversations', {
        body: { user_uuid: userId }
      });

      if (!functionError && functionData) {
        console.log('Conversations loaded via function:', functionData);
        return functionData;
      } else {
        console.log('Function failed, trying direct database query. Error:', functionError);
        
        // Fallback to direct table query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('chat_conversations')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });

        if (!fallbackError && fallbackData) {
          console.log('Conversations loaded via direct query:', fallbackData);
          return fallbackData;
        } else {
          console.error('Error loading conversations via fallback:', fallbackError);
          return [];
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }

  static async createConversation(userId: string, title: string): Promise<string | null> {
    console.log('Creating new conversation with title:', title);

    const { data: newConv, error: convError } = await supabase
      .from('chat_conversations')
      .insert({
        user_id: userId,
        title,
        message_count: 0
      })
      .select()
      .single();

    if (convError || !newConv) {
      console.error('Error creating conversation:', convError);
      return null;
    }

    return newConv.id;
  }

  static async deleteConversation(conversationId: string, userId: string): Promise<boolean> {
    console.log('Deleting conversation:', conversationId);
    
    const { error } = await supabase
      .from('chat_conversations')
      .delete()
      .eq('id', conversationId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }

    return true;
  }

  static async updateConversationTimestamp(conversationId: string): Promise<void> {
    await supabase
      .from('chat_conversations')
      .update({ 
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);
  }

  static async incrementMessageCount(conversationId: string): Promise<void> {
    try {
      await supabase.rpc('increment_message_count', { 
        conversation_id: conversationId 
      });
    } catch (incrementError) {
      console.warn('Could not increment message count:', incrementError);
    }
  }
}
