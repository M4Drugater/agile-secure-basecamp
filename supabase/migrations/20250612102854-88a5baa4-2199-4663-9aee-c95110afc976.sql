
-- Create research_sessions table to store Perplexity research data
CREATE TABLE public.research_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  query TEXT NOT NULL,
  research_type TEXT NOT NULL CHECK (research_type IN ('quick', 'comprehensive', 'industry-specific')),
  industry TEXT,
  content TEXT NOT NULL,
  sources JSONB DEFAULT '[]'::jsonb,
  insights TEXT[] DEFAULT ARRAY[]::TEXT[],
  keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  credits_used INTEGER NOT NULL DEFAULT 0,
  model_used TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.research_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for research_sessions
CREATE POLICY "Users can view their own research sessions" 
  ON public.research_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own research sessions" 
  ON public.research_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own research sessions" 
  ON public.research_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own research sessions" 
  ON public.research_sessions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER set_updated_at_research_sessions
  BEFORE UPDATE ON public.research_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
