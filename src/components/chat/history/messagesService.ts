
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '../types';

export class MessagesService {
  static async loadConversationMessages(conversationId: string): Promise<ChatMessage[]> {
    console.log('Loading messages for conversation:', conversationId);
    
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        console.log('Messages loaded:', data.length);
        return data.map((msg: any) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at)
        }));
      } else {
        console.error('Error loading messages:', error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    
    return [];
  }

  static async saveMessage(message: ChatMessage, conversationId: string): Promise<boolean> {
    console.log('Saving message to conversation:', conversationId);
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: message.role,
          content: message.content
        });

      if (error) {
        console.error('Error saving message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving message:', error);
      return false;
    }
  }
}
