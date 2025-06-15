
-- Create enhanced competitive intelligence sessions table with unified session support
CREATE TABLE IF NOT EXISTS public.unified_ci_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  analysis_focus TEXT,
  objectives TEXT,
  geographic_scope TEXT DEFAULT 'Global',
  analysis_depth TEXT DEFAULT 'Detailed',
  session_state JSONB DEFAULT '{}',
  active_agents TEXT[] DEFAULT '{}',
  progress_tracker JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaborative agent interactions table
CREATE TABLE IF NOT EXISTS public.agent_collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.unified_ci_sessions(id) ON DELETE CASCADE,
  source_agent TEXT NOT NULL,
  target_agent TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('data_sharing', 'insight_validation', 'recommendation_merge')),
  interaction_data JSONB NOT NULL,
  confidence_score INTEGER DEFAULT 85 CHECK (confidence_score BETWEEN 0 AND 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create intelligent outputs table for bridging to content and knowledge
CREATE TABLE IF NOT EXISTS public.intelligent_outputs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.unified_ci_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  output_type TEXT NOT NULL CHECK (output_type IN ('strategic_report', 'market_analysis', 'competitive_brief', 'action_plan')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  insights_generated TEXT[] DEFAULT '{}',
  action_items JSONB DEFAULT '[]',
  knowledge_updates JSONB DEFAULT '[]',
  content_suggestions JSONB DEFAULT '[]',
  auto_applied_to_kb BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session analytics table for tracking effectiveness
CREATE TABLE IF NOT EXISTS public.session_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.unified_ci_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agents_used TEXT[] NOT NULL,
  insights_generated INTEGER DEFAULT 0,
  reports_created INTEGER DEFAULT 0,
  knowledge_updates INTEGER DEFAULT 0,
  content_pieces_generated INTEGER DEFAULT 0,
  session_duration INTEGER, -- in minutes
  effectiveness_score INTEGER CHECK (effectiveness_score BETWEEN 0 AND 100),
  user_satisfaction INTEGER CHECK (user_satisfaction BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.unified_ci_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intelligent_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for unified_ci_sessions
CREATE POLICY "Users can view their own unified sessions" 
  ON public.unified_ci_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own unified sessions" 
  ON public.unified_ci_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own unified sessions" 
  ON public.unified_ci_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own unified sessions" 
  ON public.unified_ci_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for agent_collaborations
CREATE POLICY "Users can view collaborations for their sessions" 
  ON public.agent_collaborations 
  FOR SELECT 
  USING (
    session_id IN (
      SELECT id FROM public.unified_ci_sessions WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create collaborations for their sessions" 
  ON public.agent_collaborations 
  FOR INSERT 
  WITH CHECK (
    session_id IN (
      SELECT id FROM public.unified_ci_sessions WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for intelligent_outputs
CREATE POLICY "Users can view their own intelligent outputs" 
  ON public.intelligent_outputs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intelligent outputs" 
  ON public.intelligent_outputs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intelligent outputs" 
  ON public.intelligent_outputs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own intelligent outputs" 
  ON public.intelligent_outputs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for session_analytics
CREATE POLICY "Users can view their own session analytics" 
  ON public.session_analytics 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own session analytics" 
  ON public.session_analytics 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own session analytics" 
  ON public.session_analytics 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_unified_ci_sessions_updated_at
  BEFORE UPDATE ON public.unified_ci_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_intelligent_outputs_updated_at
  BEFORE UPDATE ON public.intelligent_outputs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate session effectiveness
CREATE OR REPLACE FUNCTION public.calculate_session_effectiveness(session_uuid uuid)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  insights_count INTEGER;
  reports_count INTEGER;
  knowledge_updates_count INTEGER;
  content_generated_count INTEGER;
  effectiveness_score INTEGER;
BEGIN
  -- Get session metrics
  SELECT 
    COALESCE(insights_generated, 0),
    COALESCE(reports_created, 0),
    COALESCE(knowledge_updates, 0),
    COALESCE(content_pieces_generated, 0)
  INTO 
    insights_count,
    reports_count,
    knowledge_updates_count,
    content_generated_count
  FROM public.session_analytics
  WHERE session_id = session_uuid;

  -- Calculate effectiveness score (0-100)
  effectiveness_score := LEAST(100, 
    (insights_count * 20) + 
    (reports_count * 25) + 
    (knowledge_updates_count * 30) + 
    (content_generated_count * 25)
  );

  RETURN effectiveness_score;
END;
$$;

-- Create function to auto-update knowledge base from sessions
CREATE OR REPLACE FUNCTION public.auto_update_knowledge_from_session(
  session_uuid uuid,
  user_uuid uuid
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  session_record RECORD;
  knowledge_title TEXT;
  knowledge_content TEXT;
BEGIN
  -- Get session data
  SELECT * INTO session_record
  FROM public.unified_ci_sessions
  WHERE id = session_uuid AND user_id = user_uuid;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  -- Create knowledge base entry from session insights
  knowledge_title := 'CI Analysis: ' || session_record.company_name || ' - ' || session_record.industry;
  knowledge_content := 'Competitive Intelligence session insights for ' || session_record.company_name || 
                      ' in the ' || session_record.industry || ' industry. ' ||
                      'Analysis focus: ' || COALESCE(session_record.analysis_focus, 'General competitive landscape') || '. ' ||
                      'Generated from session on ' || session_record.created_at::date;

  -- Insert into user knowledge base
  INSERT INTO public.user_knowledge_files (
    user_id,
    title,
    description,
    content,
    file_type,
    tags,
    processing_status,
    ai_summary
  ) VALUES (
    user_uuid,
    knowledge_title,
    'Auto-generated from competitive intelligence session',
    knowledge_content,
    'competitive_analysis',
    ARRAY['competitive-intelligence', session_record.industry, 'auto-generated'],
    'completed',
    'Competitive intelligence insights for strategic decision making'
  );

  RETURN TRUE;
END;
$$;
