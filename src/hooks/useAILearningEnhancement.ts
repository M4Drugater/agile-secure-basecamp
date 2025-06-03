
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface AIRecommendation {
  id: string;
  type: 'learning_path' | 'module' | 'resource';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  metadata: any;
}

export interface AdaptiveDifficultyAdjustment {
  currentDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  recommendedDifficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
  reasoning: string;
  adjustmentFactors: {
    completionRate: number;
    timeSpent: number;
    assessmentScores: number;
    strugglingAreas: string[];
  };
}

export function useAILearningEnhancement() {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const generatePersonalizedRecommendations = useCallback(async (learningPathId?: string) => {
    if (!user) return [];

    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-learning-enhancement', {
        body: {
          action: 'generate_recommendations',
          userId: user.id,
          learningPathId,
          context: {
            includePersonalInterests: true,
            includeProgressHistory: true,
            includeSkillGaps: true,
          }
        }
      });

      if (error) throw error;
      
      setRecommendations(data.recommendations || []);
      return data.recommendations || [];
    } catch (error) {
      console.error('Error generating AI recommendations:', error);
      toast({
        title: "Recommendation Error",
        description: "Unable to generate personalized recommendations at this time.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, [user]);

  const analyzeDifficultyAdjustment = useCallback(async (
    learningPathId: string,
    moduleId?: string
  ): Promise<AdaptiveDifficultyAdjustment | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('ai-learning-enhancement', {
        body: {
          action: 'analyze_difficulty',
          userId: user.id,
          learningPathId,
          moduleId,
        }
      });

      if (error) throw error;
      return data.difficultyAnalysis || null;
    } catch (error) {
      console.error('Error analyzing difficulty adjustment:', error);
      return null;
    }
  }, [user]);

  const generateSmartLearningPath = useCallback(async (goals: string[], skillLevel: string) => {
    if (!user) return null;

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-learning-enhancement', {
        body: {
          action: 'generate_learning_path',
          userId: user.id,
          goals,
          skillLevel,
          personalizeToUser: true,
        }
      });

      if (error) throw error;
      
      toast({
        title: "Learning Path Generated",
        description: "AI has created a personalized learning path for you!",
      });

      return data.learningPath;
    } catch (error) {
      console.error('Error generating smart learning path:', error);
      toast({
        title: "Generation Error",
        description: "Unable to generate learning path at this time.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user]);

  const enhanceModuleContent = useCallback(async (moduleId: string, userContext: any) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('ai-learning-enhancement', {
        body: {
          action: 'enhance_module_content',
          userId: user.id,
          moduleId,
          userContext,
        }
      });

      if (error) throw error;
      return data.enhancedContent;
    } catch (error) {
      console.error('Error enhancing module content:', error);
      return null;
    }
  }, [user]);

  return {
    isAnalyzing,
    recommendations,
    generatePersonalizedRecommendations,
    analyzeDifficultyAdjustment,
    generateSmartLearningPath,
    enhanceModuleContent,
  };
}
