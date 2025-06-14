
export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  route?: string;
  order: number;
}

export interface UserJourney {
  id?: string;
  user_id: string;
  current_step: number;
  completed_steps: string[];
  profile_completed: boolean;
  knowledge_setup: boolean;
  first_chat_completed: boolean;
  first_content_created: boolean;
  cdv_introduced: boolean;
  created_at?: string;
  updated_at?: string;
}
