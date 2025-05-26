
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserProfile, UserProfile } from '@/hooks/useUserProfile';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const profileSchema = z.object({
  full_name: z.string().optional(),
  current_position: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  experience_level: z.string().optional(),
  years_of_experience: z.number().optional(),
  management_level: z.string().optional(),
  team_size: z.number().optional(),
  leadership_experience: z.boolean().optional(),
  target_position: z.string().optional(),
  target_industry: z.string().optional(),
  target_salary_range: z.string().optional(),
  learning_style: z.string().optional(),
  communication_style: z.string().optional(),
  feedback_preference: z.string().optional(),
  work_environment: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

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
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>
            Complete your profile to get personalized AI mentoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completeness</span>
              <span>{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Your current company" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_of_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="target_position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Engineering Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="target_industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Industry</FormLabel>
                      <FormControl>
                        <Input placeholder="Industry you want to work in" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="target_salary_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Salary Range</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select salary range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="50k-75k">$50k - $75k</SelectItem>
                        <SelectItem value="75k-100k">$75k - $100k</SelectItem>
                        <SelectItem value="100k-150k">$100k - $150k</SelectItem>
                        <SelectItem value="150k-200k">$150k - $200k</SelectItem>
                        <SelectItem value="200k+">$200k+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="learning_style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Learning Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How do you learn best?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="visual">Visual</SelectItem>
                          <SelectItem value="auditory">Auditory</SelectItem>
                          <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                          <SelectItem value="reading">Reading/Writing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communication_style"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How do you prefer to communicate?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="direct">Direct</SelectItem>
                          <SelectItem value="collaborative">Collaborative</SelectItem>
                          <SelectItem value="analytical">Analytical</SelectItem>
                          <SelectItem value="supportive">Supportive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="feedback_preference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="How do you prefer to receive feedback?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="frequent">Frequent check-ins</SelectItem>
                        <SelectItem value="structured">Structured reviews</SelectItem>
                        <SelectItem value="informal">Informal conversations</SelectItem>
                        <SelectItem value="written">Written feedback</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isUpdating} className="w-full">
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
