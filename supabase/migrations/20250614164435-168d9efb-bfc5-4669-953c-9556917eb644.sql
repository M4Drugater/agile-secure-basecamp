
-- Create the user_journey table to track user onboarding progress
CREATE TABLE public.user_journey (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 0,
  completed_steps TEXT[] NOT NULL DEFAULT '{}',
  profile_completed BOOLEAN NOT NULL DEFAULT FALSE,
  knowledge_setup BOOLEAN NOT NULL DEFAULT FALSE,
  first_chat_completed BOOLEAN NOT NULL DEFAULT FALSE,
  first_content_created BOOLEAN NOT NULL DEFAULT FALSE,
  cdv_introduced BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_journey ENABLE ROW LEVEL SECURITY;

-- Create RLS policies so users can only access their own journey data
CREATE POLICY "Users can view their own journey" 
  ON public.user_journey 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journey" 
  ON public.user_journey 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journey" 
  ON public.user_journey 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_journey_updated_at
  BEFORE UPDATE ON public.user_journey
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique constraint to ensure one journey per user
ALTER TABLE public.user_journey 
ADD CONSTRAINT unique_user_journey UNIQUE (user_id);
