
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileFormData } from './profileFormSchema';

interface LearningPreferencesSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export function LearningPreferencesSection({ form }: LearningPreferencesSectionProps) {
  return (
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
                    <SelectItem value="visual">Visual Learner</SelectItem>
                    <SelectItem value="auditory">Auditory Learner</SelectItem>
                    <SelectItem value="kinesthetic">Hands-on Learner</SelectItem>
                    <SelectItem value="reading_writing">Reading/Writing</SelectItem>
                    <SelectItem value="mixed">Mixed Approach</SelectItem>
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
                    <SelectItem value="direct">Direct & Concise</SelectItem>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                    <SelectItem value="analytical">Analytical & Data-driven</SelectItem>
                    <SelectItem value="supportive">Supportive & Encouraging</SelectItem>
                    <SelectItem value="formal">Formal & Structured</SelectItem>
                    <SelectItem value="casual">Casual & Informal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="feedback_preference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Feedback Preference</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="How do you prefer feedback?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="frequent">Frequent Check-ins</SelectItem>
                    <SelectItem value="structured">Structured Reviews</SelectItem>
                    <SelectItem value="informal">Informal Conversations</SelectItem>
                    <SelectItem value="written">Written Feedback</SelectItem>
                    <SelectItem value="verbal">Verbal Feedback</SelectItem>
                    <SelectItem value="peer_review">Peer Reviews</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="work_environment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Work Environment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select work environment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="office">Office-based</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="startup">Startup Environment</SelectItem>
                    <SelectItem value="corporate">Corporate Environment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
