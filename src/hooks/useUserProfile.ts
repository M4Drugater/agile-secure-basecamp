
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSecureAuthContext } from '@/components/auth/SecureAuthProvider';
import { toast } from '@/hooks/use-toast';
import { useDataValidation } from './useDataValidation';
import { useAuditLogger } from './useAuditLogger';
import { InputSanitizer } from '@/utils/inputSanitization';

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
  const { user } = useSecureAuthContext();
  const queryClient = useQueryClient();
  const { sanitizeAndValidate, validators } = useDataValidation();
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

      // Enhanced validation rules with sanitization
      const validationRules = [
        {
          field: 'full_name',
          validator: (value: string) => !value || (validators.validateMinLength(value, 1) && validators.validateMaxLength(value, 100)),
          message: 'Full name must be between 1 and 100 characters',
          sanitizer: (value: string) => value ? InputSanitizer.sanitizeText(value, { maxLength: 100, stripWhitespace: true }) : value
        },
        {
          field: 'email',
          validator: (value: string) => !value || validators.validateEmail(value),
          message: 'Please enter a valid email address',
          sanitizer: (value: string) => value ? InputSanitizer.sanitizeEmail(value) : value
        },
        {
          field: 'current_position',
          validator: (value: string) => !value || validators.validateMaxLength(value, 200),
          message: 'Current position must be less than 200 characters',
          sanitizer: (value: string) => value ? InputSanitizer.sanitizeText(value, { maxLength: 200, stripWhitespace: true }) : value
        },
        {
          field: 'company',
          validator: (value: string) => !value || validators.validateMaxLength(value, 200),
          message: 'Company name must be less than 200 characters',
          sanitizer: (value: string) => value ? InputSanitizer.sanitizeText(value, { maxLength: 200, stripWhitespace: true }) : value
        },
        {
          field: 'target_position',
          validator: (value: string) => !value || validators.validateMaxLength(value, 200),
          message: 'Target position must be less than 200 characters',
          sanitizer: (value: string) => value ? InputSanitizer.sanitizeText(value, { maxLength: 200, stripWhitespace: true }) : value
        },
        {
          field: 'target_industry',
          validator: (value: string) => !value || validators.validateMaxLength(value, 200),
          message: 'Target industry must be less than 200 characters',
          sanitizer: (value: string) => value ? InputSanitizer.sanitizeText(value, { maxLength: 200, stripWhitespace: true }) : value
        },
        {
          field: 'years_of_experience',
          validator: (value: number) => !value || validators.validateNumericRange(value, 0, 70),
          message: 'Years of experience must be between 0 and 70'
        },
        {
          field: 'team_size',
          validator: (value: number) => !value || validators.validateNumericRange(value, 0, 100000),
          message: 'Team size must be a positive number less than 100,000'
        }
      ];

      const result = await sanitizeAndValidate(profileData, validationRules, {
        enableSanitization: true,
        maxFieldLength: 1000,
        allowHtml: false
      });

      if (!result.isValid) {
        throw new Error('Validation failed');
      }

      const cleanedData = Object.fromEntries(
        Object.entries(result.sanitizedData).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );

      // Additional security checks
      const sensitiveFields = ['role', 'is_active', 'id', 'created_at'];
      const hasRestrictedFields = Object.keys(cleanedData).some(field => 
        sensitiveFields.includes(field)
      );

      if (hasRestrictedFields) {
        logAction({
          action: 'security_violation',
          resource_type: 'profile',
          resource_id: user.id,
          details: {
            violation_type: 'attempted_restricted_field_update',
            attempted_fields: Object.keys(cleanedData).filter(field => 
              sensitiveFields.includes(field)
            )
          }
        });
        throw new Error('Cannot update restricted fields');
      }

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
      
      logAction({
        action: 'profile_updated',
        resource_type: 'profile',
        resource_id: user?.id,
        details: {
          profile_completeness: data?.profile_completeness,
          fields_updated: Object.keys(data || {}),
          security_sanitized: true
        }
      });

      toast({
        title: "Profile updated",
        description: `Your profile has been updated successfully. ${data?.profile_completeness || 0}% complete.`,
      });
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      
      logAction({
        action: 'profile_update_failed',
        resource_type: 'profile',
        resource_id: user?.id,
        details: {
          error_message: error.message,
          error_code: error.code,
          security_check: true
        }
      });

      let errorMessage = "Failed to update profile. Please try again.";
      
      if (error.message?.includes('email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message?.includes('validation')) {
        errorMessage = "Please check your input and try again.";
      } else if (error.message?.includes('restricted')) {
        errorMessage = "You cannot modify restricted profile fields.";
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
