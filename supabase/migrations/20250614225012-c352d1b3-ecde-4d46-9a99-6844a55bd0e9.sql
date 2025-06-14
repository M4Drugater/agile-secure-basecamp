
-- Fix the user_journey table constraint issues
-- The errors suggest duplicate key violations for unique_user_journey constraint
-- We need to clean up any duplicate records and ensure proper upsert handling

-- First, let's check if there are duplicate records and clean them up
WITH duplicate_journeys AS (
  SELECT user_id, COUNT(*) as count
  FROM public.user_journey
  GROUP BY user_id
  HAVING COUNT(*) > 1
),
keep_records AS (
  SELECT DISTINCT ON (user_id) id, user_id
  FROM public.user_journey
  WHERE user_id IN (SELECT user_id FROM duplicate_journeys)
  ORDER BY user_id, created_at DESC
)
DELETE FROM public.user_journey 
WHERE user_id IN (SELECT user_id FROM duplicate_journeys)
  AND id NOT IN (SELECT id FROM keep_records);

-- Add proper indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_journey_user_id ON public.user_journey(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON public.content_items(user_id);

-- Optimize frequently accessed queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_created ON public.ai_usage_logs(user_id, created_at);

-- Add missing RLS policies for security
ALTER TABLE public.user_journey ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own journey" ON public.user_journey;
CREATE POLICY "Users can view their own journey" 
  ON public.user_journey 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own journey" ON public.user_journey;
CREATE POLICY "Users can insert their own journey" 
  ON public.user_journey 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own journey" ON public.user_journey;
CREATE POLICY "Users can update their own journey" 
  ON public.user_journey 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Enable RLS on other critical tables if not already enabled
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Add missing RLS policies for user_credits
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
CREATE POLICY "Users can view their own credits" 
  ON public.user_credits 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;
CREATE POLICY "Users can update their own credits" 
  ON public.user_credits 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add missing RLS policies for credit_transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.credit_transactions;
CREATE POLICY "Users can view their own transactions" 
  ON public.credit_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add missing RLS policies for content_items
DROP POLICY IF EXISTS "Users can view their own content" ON public.content_items;
CREATE POLICY "Users can view their own content" 
  ON public.content_items 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own content" ON public.content_items;
CREATE POLICY "Users can create their own content" 
  ON public.content_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own content" ON public.content_items;
CREATE POLICY "Users can update their own content" 
  ON public.content_items 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own content" ON public.content_items;
CREATE POLICY "Users can delete their own content" 
  ON public.content_items 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add missing RLS policies for chat_conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can view their own conversations" 
  ON public.chat_conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can create their own conversations" 
  ON public.chat_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own conversations" ON public.chat_conversations;
CREATE POLICY "Users can update their own conversations" 
  ON public.chat_conversations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add missing RLS policies for chat_messages (through conversation ownership)
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.chat_messages;
CREATE POLICY "Users can view messages in their conversations" 
  ON public.chat_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create messages in their conversations" ON public.chat_messages;
CREATE POLICY "Users can create messages in their conversations" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- Create a function to safely upsert user journey to prevent constraint violations
CREATE OR REPLACE FUNCTION public.upsert_user_journey(
  p_user_id UUID,
  p_current_step INTEGER DEFAULT NULL,
  p_completed_steps TEXT[] DEFAULT NULL,
  p_profile_completed BOOLEAN DEFAULT NULL,
  p_knowledge_setup BOOLEAN DEFAULT NULL,
  p_first_chat_completed BOOLEAN DEFAULT NULL,
  p_first_content_created BOOLEAN DEFAULT NULL,
  p_cdv_introduced BOOLEAN DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  journey_id UUID;
BEGIN
  INSERT INTO public.user_journey (
    user_id,
    current_step,
    completed_steps,
    profile_completed,
    knowledge_setup,
    first_chat_completed,
    first_content_created,
    cdv_introduced,
    updated_at
  )
  VALUES (
    p_user_id,
    COALESCE(p_current_step, 0),
    COALESCE(p_completed_steps, '{}'),
    COALESCE(p_profile_completed, false),
    COALESCE(p_knowledge_setup, false),
    COALESCE(p_first_chat_completed, false),
    COALESCE(p_first_content_created, false),
    COALESCE(p_cdv_introduced, false),
    now()
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    current_step = COALESCE(p_current_step, user_journey.current_step),
    completed_steps = COALESCE(p_completed_steps, user_journey.completed_steps),
    profile_completed = COALESCE(p_profile_completed, user_journey.profile_completed),
    knowledge_setup = COALESCE(p_knowledge_setup, user_journey.knowledge_setup),
    first_chat_completed = COALESCE(p_first_chat_completed, user_journey.first_chat_completed),
    first_content_created = COALESCE(p_first_content_created, user_journey.first_content_created),
    cdv_introduced = COALESCE(p_cdv_introduced, user_journey.cdv_introduced),
    updated_at = now()
  RETURNING id INTO journey_id;
  
  RETURN journey_id;
END;
$$;
