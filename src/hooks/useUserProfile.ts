
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useDataValidation } from './useDataValidation';
import { useAuditLogger } from './useAuditLogger';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active?: boolean;
  current_position?: string;
  company?: string;
  industry?: string;
  experience_level?: string;
  years_of_experience?: number;
  management_level?: string;
  team_size?: number;
  leadership_experience?: boolean;
  target_position?: string;
  target_industry?: string;
  target_salary_range?: string;
  career_goals?: string[];
  current_skills?: string[];
  skill_gaps?: string[];
  learning_priorities?: string[];
  learning_style?: string;
  communication_style?: string;
  feedback_preference?: string;
  work_environment?: string;
  certifications?: string[];
  profile_completeness?: number;
  last_updated?: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { validate, validators } = useDataValidation();
  const { logAction } = useAuditLogger();

  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;

      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      console.log('Profile data:', data);
      return data;
    },
    enabled: !!user,
    retry: (failureCount, error: any) => {
      // Don't retry on authentication errors
      if (error?.code === 'PGRST301' || error?.message?.includes('JWT')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const createOrUpdateProfile = useMutation({
    mutationFn: async (profileData: Partial<UserProfile>) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating profile with data:', profileData);

      // Validate the profile data
      const validationRules = [
        {
          field: 'full_name',
          validator: (value: string) => !value || validators.validateMinLength(value, 1),
          message: 'Full name is required'
        },
        {
          field: 'email',
          validator: (value: string) => !value || validators.validateEmail(value),
          message: 'Please enter a valid email address'
        },
        {
          field: 'years_of_experience',
          validator: (value: number) => !value || validators.validateNumericRange(value, 0, 50),
          message: 'Years of experience must be between 0 and 50'
        },
        {
          field: 'team_size',
          validator: (value: number) => !value || validators.validateNumericRange(value, 0, 10000),
          message: 'Team size must be a positive number'
        }
      ];

      const isValid = await validate(profileData, validationRules);
      if (!isValid) {
        throw new Error('Validation failed');
      }

      // Clean the data to only include defined values
      const cleanedData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...cleanedData,
          last_updated: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', user?.id] });
      console.log('Profile completion:', data?.profile_completeness);
      
      // Log the profile update action
      logAction({
        action: 'profile_updated',
        resource_type: 'profile',
        resource_id: user?.id,
        details: {
          profile_completeness: data?.profile_completeness,
          fields_updated: Object.keys(data || {})
        }
      });

      toast({
        title: "Profile updated",
        description: `Your profile has been updated successfully. ${data?.profile_completeness || 0}% complete.`,
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      
      // Log the failed update attempt
      logAction({
        action: 'profile_update_failed',
        resource_type: 'profile',
        resource_id: user?.id,
        details: {
          error_message: error.message,
          error_code: error.code
        }
      });

      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error.message?.includes('email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message?.includes('validation')) {
        errorMessage = "Please check your input and try again.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: createOrUpdateProfile.mutate,
    isUpdating: createOrUpdateProfile.isPending,
  };
}
