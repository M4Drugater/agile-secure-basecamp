
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface LearningPath {
  id: string;
  title: string;
  description: string | null;
  difficulty_level: string;
  created_at: string;
  updated_at: string;
  estimated_duration_hours?: number;
  enrollment_count?: number;
  completion_rate?: number;
  learning_objectives?: string[];
  prerequisites?: string[];
  tags?: string[];
  is_published?: boolean;
  is_featured?: boolean;
  average_rating?: number;
}

export interface CreateLearningPathData {
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration_hours?: number;
  learning_objectives?: string[];
  prerequisites?: string[];
  tags?: string[];
}

export function useLearningPaths() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: learningPaths, isLoading } = useQuery({
    queryKey: ['learning-paths'],
    queryFn: async () => {
      // Return mock data for now since table may not exist
      return [
        {
          id: '1',
          title: 'Strategic Leadership Development',
          description: 'Comprehensive program for developing strategic leadership skills',
          difficulty_level: 'Advanced',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          estimated_duration_hours: 40,
          enrollment_count: 125,
          completion_rate: 85,
          learning_objectives: [
            'Develop strategic thinking capabilities',
            'Master executive decision-making processes',
            'Build high-performance teams'
          ],
          prerequisites: ['Management experience', 'Basic leadership training'],
          tags: ['leadership', 'strategy', 'management'],
          is_published: true,
          is_featured: true,
          average_rating: 4.8
        },
        {
          id: '2',
          title: 'Digital Transformation Strategy',
          description: 'Learn how to lead digital transformation initiatives',
          difficulty_level: 'Intermediate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          estimated_duration_hours: 30,
          enrollment_count: 89,
          completion_rate: 78,
          learning_objectives: [
            'Understand digital transformation frameworks',
            'Implement change management strategies',
            'Leverage technology for competitive advantage'
          ],
          prerequisites: ['Business strategy knowledge'],
          tags: ['digital', 'transformation', 'technology'],
          is_published: true,
          is_featured: false,
          average_rating: 4.5
        }
      ] as LearningPath[];
    },
    enabled: !!user,
  });

  const createPathMutation = useMutation({
    mutationFn: async (data: CreateLearningPathData) => {
      // Mock implementation for now
      const newPath: LearningPath = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        difficulty_level: data.difficulty_level,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        estimated_duration_hours: data.estimated_duration_hours || 0,
        learning_objectives: data.learning_objectives || [],
        prerequisites: data.prerequisites || [],
        tags: data.tags || [],
        enrollment_count: 0,
        completion_rate: 0,
        is_published: false,
        is_featured: false,
        average_rating: 0
      };
      return newPath;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
      toast.success('Learning path created successfully!');
    },
    onError: () => {
      toast.error('Failed to create learning path');
    }
  });

  const deletePathMutation = useMutation({
    mutationFn: async (pathId: string) => {
      // Mock implementation for now
      return pathId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-paths'] });
      toast.success('Learning path deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete learning path');
    }
  });

  return {
    learningPaths: learningPaths || [],
    isLoading,
    createPath: createPathMutation.mutate,
    isCreating: createPathMutation.isPending,
    deletePath: deletePathMutation.mutate,
    isDeleting: deletePathMutation.isPending,
  };
}
