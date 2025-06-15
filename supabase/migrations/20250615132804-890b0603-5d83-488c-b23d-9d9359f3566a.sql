
-- Phase 1: Research Sessions Table Enhancement
-- Add missing columns to research_sessions to consolidate all research functionality
ALTER TABLE public.research_sessions 
ADD COLUMN IF NOT EXISTS effectiveness INTEGER DEFAULT 75 CHECK (effectiveness BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS context_quality TEXT DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS output_format TEXT DEFAULT 'detailed-analysis',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS source_filters TEXT[],
ADD COLUMN IF NOT EXISTS time_filter TEXT,
ADD COLUMN IF NOT EXISTS confidence_threshold NUMERIC DEFAULT 0.8;

-- Update research_type to match the new enum values
ALTER TABLE public.research_sessions 
DROP CONSTRAINT IF EXISTS research_sessions_research_type_check;

ALTER TABLE public.research_sessions 
ADD CONSTRAINT research_sessions_research_type_check 
CHECK (research_type IN ('quick-scan', 'comprehensive', 'industry-deep-dive', 'competitive-analysis'));

-- Add RLS policies for research_sessions (if not already present)
DO $$ 
BEGIN
  -- Check if RLS is enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'research_sessions' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.research_sessions ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'research_sessions' 
    AND policyname = 'Users can view their own research sessions'
  ) THEN
    CREATE POLICY "Users can view their own research sessions" 
      ON public.research_sessions 
      FOR SELECT 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'research_sessions' 
    AND policyname = 'Users can create their own research sessions'
  ) THEN
    CREATE POLICY "Users can create their own research sessions" 
      ON public.research_sessions 
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'research_sessions' 
    AND policyname = 'Users can update their own research sessions'
  ) THEN
    CREATE POLICY "Users can update their own research sessions" 
      ON public.research_sessions 
      FOR UPDATE 
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'research_sessions' 
    AND policyname = 'Users can delete their own research sessions'
  ) THEN
    CREATE POLICY "Users can delete their own research sessions" 
      ON public.research_sessions 
      FOR DELETE 
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Phase 2: Enhanced Analytics Function
CREATE OR REPLACE FUNCTION public.get_enhanced_research_analytics(user_uuid uuid)
RETURNS TABLE(
  total_sessions integer,
  total_sources_found integer,
  average_effectiveness integer,
  top_industries jsonb,
  credits_used integer,
  time_spent_minutes numeric,
  favorite_research_types jsonb,
  recent_activity jsonb
)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
AS $$
DECLARE
  sessions_data RECORD;
BEGIN
  -- Get aggregated session data
  SELECT 
    COUNT(*)::integer as session_count,
    COALESCE(SUM(array_length(sources::text[], 1)), 0)::integer as source_count,
    COALESCE(ROUND(AVG(effectiveness)), 75)::integer as avg_effectiveness,
    COALESCE(SUM(credits_used), 0)::integer as total_credits,
    COALESCE(SUM((metadata->>'processingTime')::numeric), 0) / 1000 / 60 as time_minutes
  INTO sessions_data
  FROM public.research_sessions 
  WHERE user_id = user_uuid;

  -- Return comprehensive analytics
  RETURN QUERY
  WITH industry_stats AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'industry', industry, 
          'count', count(*)
        ) ORDER BY count(*) DESC
      ) FILTER (WHERE industry IS NOT NULL) as industries
    FROM public.research_sessions 
    WHERE user_id = user_uuid AND industry IS NOT NULL
    GROUP BY industry
    LIMIT 5
  ),
  type_stats AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'type', research_type, 
          'count', count(*)
        ) ORDER BY count(*) DESC
      ) as types
    FROM public.research_sessions 
    WHERE user_id = user_uuid
    GROUP BY research_type
  ),
  recent_stats AS (
    SELECT 
      jsonb_agg(
        jsonb_build_object(
          'id', id,
          'query', query,
          'created_at', created_at,
          'effectiveness', effectiveness,
          'research_type', research_type
        ) ORDER BY created_at DESC
      ) as recent
    FROM public.research_sessions 
    WHERE user_id = user_uuid
    ORDER BY created_at DESC
    LIMIT 10
  )
  SELECT 
    sessions_data.session_count,
    sessions_data.source_count,
    sessions_data.avg_effectiveness,
    COALESCE(industry_stats.industries, '[]'::jsonb),
    sessions_data.total_credits,
    sessions_data.time_minutes,
    COALESCE(type_stats.types, '[]'::jsonb),
    COALESCE(recent_stats.recent, '[]'::jsonb)
  FROM industry_stats, type_stats, recent_stats;
END;
$$;
