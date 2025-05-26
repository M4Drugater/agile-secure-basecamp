
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
                      <SelectValue placeholder="Select learning style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="visual">Visual</SelectItem>
                    <SelectItem value="auditory">Auditory</SelectItem>
                    <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                    <SelectItem value="reading_writing">Reading/Writing</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
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
                      <SelectValue placeholder="Select communication style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="collaborative">Collaborative</SelectItem>
                    <SelectItem value="analytical">Analytical</SelectItem>
                    <SelectItem value="supportive">Supportive</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
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
                      <SelectValue placeholder="Select feedback preference" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="frequent">Frequent</SelectItem>
                    <SelectItem value="structured">Structured</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="written">Written</SelectItem>
                    <SelectItem value="verbal">Verbal</SelectItem>
                    <SelectItem value="peer_review">Peer Review</SelectItem>
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
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
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
