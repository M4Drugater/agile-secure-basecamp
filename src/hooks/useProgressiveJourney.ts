
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

const JOURNEY_STEPS: Omit<JourneyStep, 'completed' | 'locked'>[] = [
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Tell us about yourself to get personalized AI experiences',
    route: '/profile',
    order: 1
  },
  {
    id: 'knowledge',
    title: 'Set Up Knowledge Base',
    description: 'Upload documents and resources for personalized assistance',
    route: '/knowledge',
    order: 2
  },
  {
    id: 'chat',
    title: 'Meet CLIPOGINO',
    description: 'Chat with your AI mentor and get personalized guidance',
    route: '/chat',
    order: 3
  },
  {
    id: 'agents',
    title: 'Explore AI Agents',
    description: 'Discover CDV, CIA, and CIR agents for competitive intelligence',
    route: '/competitive-intelligence',
    order: 4
  },
  {
    id: 'content',
    title: 'Create Content',
    description: 'Generate professional content with AI assistance',
    route: '/content-generator',
    order: 5
  }
];

export function useProgressiveJourney() {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: userJourney, isLoading } = useQuery({
    queryKey: ['userJourney', user?.id],
    queryFn: async () => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from('user_journey')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user journey:', error);
          return null;
        }

        return data;
      } catch (error) {
        console.error('Error in userJourney query:', error);
        return null;
      }
    },
    enabled: !!user,
  });

  const updateJourney = useMutation({
    mutationFn: async (updates: Partial<UserJourney>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        const { data, error } = await supabase
          .from('user_journey')
          .upsert({
            user_id: user.id,
            ...updates,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error updating user journey:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userJourney', user?.id] });
    },
  });

  const getJourneySteps = (): JourneyStep[] => {
    if (!userJourney) {
      return JOURNEY_STEPS.map((step, index) => ({
        ...step,
        completed: false,
        locked: index > 0
      }));
    }

    return JOURNEY_STEPS.map((step, index) => {
      let completed = false;
      let locked = false;

      switch (step.id) {
        case 'profile':
          completed = userJourney.profile_completed || (profile?.profile_completeness || 0) >= 70;
          locked = false;
          break;
        case 'knowledge':
          completed = userJourney.knowledge_setup;
          locked = !userJourney.profile_completed && (profile?.profile_completeness || 0) < 70;
          break;
        case 'chat':
          completed = userJourney.first_chat_completed;
          locked = !userJourney.knowledge_setup;
          break;
        case 'agents':
          completed = userJourney.cdv_introduced;
          locked = !userJourney.first_chat_completed;
          break;
        case 'content':
          completed = userJourney.first_content_created;
          locked = !userJourney.cdv_introduced;
          break;
      }

      return {
        ...step,
        completed,
        locked
      };
    });
  };

  const getNextStep = (): JourneyStep | null => {
    const steps = getJourneySteps();
    return steps.find(step => !step.completed && !step.locked) || null;
  };

  const getCurrentStepIndex = (): number => {
    const steps = getJourneySteps();
    const nextStep = getNextStep();
    if (!nextStep) return steps.length;
    return steps.findIndex(step => step.id === nextStep.id);
  };

  const completeStep = (stepId: string) => {
    const updates: Partial<UserJourney> = {};
    
    switch (stepId) {
      case 'profile':
        updates.profile_completed = true;
        break;
      case 'knowledge':
        updates.knowledge_setup = true;
        break;
      case 'chat':
        updates.first_chat_completed = true;
        break;
      case 'agents':
        updates.cdv_introduced = true;
        break;
      case 'content':
        updates.first_content_created = true;
        break;
    }

    updates.current_step = Math.max(getCurrentStepIndex() + 1, userJourney?.current_step || 0);
    updateJourney.mutate(updates);
  };

  const isJourneyComplete = (): boolean => {
    const steps = getJourneySteps();
    return steps.every(step => step.completed);
  };

  return {
    userJourney,
    isLoading,
    getJourneySteps,
    getNextStep,
    getCurrentStepIndex,
    completeStep,
    isJourneyComplete,
    updateJourney: updateJourney.mutate,
  };
}
