
-- Create competitive intelligence sessions table
CREATE TABLE public.competitive_intelligence_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_name TEXT NOT NULL,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('cdv', 'cia', 'cir')),
  company_name TEXT,
  industry TEXT,
  analysis_focus TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create competitive intelligence reports table
CREATE TABLE public.competitive_intelligence_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.competitive_intelligence_sessions NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('cdv', 'cia', 'cir')),
  report_type TEXT NOT NULL,
  title TEXT NOT NULL,
  executive_summary TEXT,
  key_findings JSONB,
  recommendations JSONB,
  data_sources JSONB,
  confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 5),
  report_content TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create competitive intelligence insights table  
CREATE TABLE public.competitive_intelligence_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.competitive_intelligence_sessions NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  agent_type TEXT NOT NULL CHECK (agent_type IN ('cdv', 'cia', 'cir')),
  insight_category TEXT NOT NULL,
  insight_title TEXT NOT NULL,
  insight_description TEXT NOT NULL,
  impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'immediate')),
  source_data JSONB,
  confidence_score INTEGER CHECK (confidence_score >= 1 AND confidence_score <= 100),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.competitive_intelligence_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_intelligence_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitive_intelligence_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sessions
CREATE POLICY "Users can view their own CI sessions" 
  ON public.competitive_intelligence_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CI sessions" 
  ON public.competitive_intelligence_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CI sessions" 
  ON public.competitive_intelligence_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CI sessions" 
  ON public.competitive_intelligence_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for reports
CREATE POLICY "Users can view their own CI reports" 
  ON public.competitive_intelligence_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CI reports" 
  ON public.competitive_intelligence_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CI reports" 
  ON public.competitive_intelligence_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CI reports" 
  ON public.competitive_intelligence_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for insights
CREATE POLICY "Users can view their own CI insights" 
  ON public.competitive_intelligence_insights 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own CI insights" 
  ON public.competitive_intelligence_insights 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own CI insights" 
  ON public.competitive_intelligence_insights 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CI insights" 
  ON public.competitive_intelligence_insights 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_ci_sessions_user_id ON public.competitive_intelligence_sessions(user_id);
CREATE INDEX idx_ci_sessions_agent_type ON public.competitive_intelligence_sessions(agent_type);
CREATE INDEX idx_ci_reports_session_id ON public.competitive_intelligence_reports(session_id);
CREATE INDEX idx_ci_reports_user_id ON public.competitive_intelligence_reports(user_id);
CREATE INDEX idx_ci_insights_session_id ON public.competitive_intelligence_insights(session_id);
CREATE INDEX idx_ci_insights_user_id ON public.competitive_intelligence_insights(user_id);
