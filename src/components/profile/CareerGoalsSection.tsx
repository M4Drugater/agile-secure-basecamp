
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ProfileFormData } from './profileFormSchema';

interface CareerGoalsSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export function CareerGoalsSection({ form }: CareerGoalsSectionProps) {
  return (
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
                  <Input placeholder="e.g., Senior Software Engineer" {...field} />
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
                  <Input placeholder="e.g., Fintech, Healthcare" {...field} />
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
                  <SelectItem value="under_50k">Under $50,000</SelectItem>
                  <SelectItem value="50k_75k">$50,000 - $75,000</SelectItem>
                  <SelectItem value="75k_100k">$75,000 - $100,000</SelectItem>
                  <SelectItem value="100k_150k">$100,000 - $150,000</SelectItem>
                  <SelectItem value="150k_200k">$150,000 - $200,000</SelectItem>
                  <SelectItem value="200k_300k">$200,000 - $300,000</SelectItem>
                  <SelectItem value="over_300k">Over $300,000</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
