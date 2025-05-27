
export interface ChatConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatHistoryState {
  conversations: ChatConversation[];
  currentConversationId: string | null;
  isLoading: boolean;
}
