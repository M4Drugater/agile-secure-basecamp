
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useUserProfile } from '@/hooks/useUserProfile';
import { ProfileCompletionHeader } from './ProfileCompletionHeader';
import { PersonalInformationSection } from './PersonalInformationSection';
import { CareerGoalsSection } from './CareerGoalsSection';
import { LearningPreferencesSection } from './LearningPreferencesSection';
import { profileSchema, ProfileFormData } from './profileFormSchema';

export function UserProfileForm() {
  const { profile, updateProfile, isUpdating } = useUserProfile();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      current_position: profile?.current_position || '',
      company: profile?.company || '',
      industry: profile?.industry || '',
      experience_level: profile?.experience_level || '',
      years_of_experience: profile?.years_of_experience || 0,
      management_level: profile?.management_level || '',
      team_size: profile?.team_size || 0,
      leadership_experience: profile?.leadership_experience || false,
      target_position: profile?.target_position || '',
      target_industry: profile?.target_industry || '',
      target_salary_range: profile?.target_salary_range || '',
      learning_style: profile?.learning_style || '',
      communication_style: profile?.communication_style || '',
      feedback_preference: profile?.feedback_preference || '',
      work_environment: profile?.work_environment || '',
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        current_position: profile.current_position || '',
        company: profile.company || '',
        industry: profile.industry || '',
        experience_level: profile.experience_level || '',
        years_of_experience: profile.years_of_experience || 0,
        management_level: profile.management_level || '',
        team_size: profile.team_size || 0,
        leadership_experience: profile.leadership_experience || false,
        target_position: profile.target_position || '',
        target_industry: profile.target_industry || '',
        target_salary_range: profile.target_salary_range || '',
        learning_style: profile.learning_style || '',
        communication_style: profile.communication_style || '',
        feedback_preference: profile.feedback_preference || '',
        work_environment: profile.work_environment || '',
      });
    }
  }, [profile, form]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile(data);
  };

  const completionPercentage = profile?.profile_completeness || 0;

  return (
    <div className="space-y-6">
      <ProfileCompletionHeader completionPercentage={completionPercentage} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInformationSection form={form} />
          <CareerGoalsSection form={form} />
          <LearningPreferencesSection form={form} />

          <Button type="submit" disabled={isUpdating} className="w-full">
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
