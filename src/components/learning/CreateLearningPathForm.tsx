
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';
import { useLearningPaths, CreateLearningPathData } from '@/hooks/useLearningPaths';
import { useAuth } from '@/contexts/AuthContext';

const learningPathSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  estimated_duration_hours: z.number().min(1, 'Duration must be at least 1 hour').max(200, 'Duration must be less than 200 hours'),
  prerequisites: z.array(z.string()).optional(),
  learning_objectives: z.array(z.string()).min(1, 'At least one learning objective is required'),
  tags: z.array(z.string()).optional(),
  is_published: z.boolean().default(false),
  is_featured: z.boolean().default(false),
});

type FormData = z.infer<typeof learningPathSchema>;

interface CreateLearningPathFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLearningPathForm({ open, onOpenChange }: CreateLearningPathFormProps) {
  const { profile } = useAuth();
  const { createPath, isCreating } = useLearningPaths();
  const [currentPrerequisite, setCurrentPrerequisite] = useState('');
  const [currentObjective, setCurrentObjective] = useState('');
  const [currentTag, setCurrentTag] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(learningPathSchema),
    defaultValues: {
      title: '',
      description: '',
      difficulty_level: 'beginner',
      estimated_duration_hours: 1,
      prerequisites: [],
      learning_objectives: [],
      tags: [],
      is_published: false,
      is_featured: false,
    },
  });

  const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

  const onSubmit = (data: FormData) => {
    const createData: CreateLearningPathData = {
      ...data,
      metadata: {
        created_via: 'form',
        version: '1.0',
      },
    };

    createPath(createData);
    onOpenChange(false);
    form.reset();
  };

  const addPrerequisite = () => {
    if (currentPrerequisite.trim()) {
      const current = form.getValues('prerequisites') || [];
      form.setValue('prerequisites', [...current, currentPrerequisite.trim()]);
      setCurrentPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    const current = form.getValues('prerequisites') || [];
    form.setValue('prerequisites', current.filter((_, i) => i !== index));
  };

  const addObjective = () => {
    if (currentObjective.trim()) {
      const current = form.getValues('learning_objectives') || [];
      form.setValue('learning_objectives', [...current, currentObjective.trim()]);
      setCurrentObjective('');
    }
  };

  const removeObjective = (index: number) => {
    const current = form.getValues('learning_objectives') || [];
    form.setValue('learning_objectives', current.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim()) {
      const current = form.getValues('tags') || [];
      form.setValue('tags', [...current, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    const current = form.getValues('tags') || [];
    form.setValue('tags', current.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Learning Path</DialogTitle>
          <DialogDescription>
            Create a structured learning journey for your students. You can add modules and content after creating the path.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Introduction to Leadership" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what students will learn and achieve..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="difficulty_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimated_duration_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Hours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="200"
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Prerequisites</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add prerequisite knowledge or skills"
                  value={currentPrerequisite}
                  onChange={(e) => setCurrentPrerequisite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                />
                <Button type="button" onClick={addPrerequisite} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.watch('prerequisites') || []).map((prereq, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {prereq}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removePrerequisite(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Learning Objectives</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="What will students achieve after completing this path?"
                  value={currentObjective}
                  onChange={(e) => setCurrentObjective(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                />
                <Button type="button" onClick={addObjective} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.watch('learning_objectives') || []).map((objective, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {objective}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeObjective(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tags for better organization"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.watch('tags') || []).map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Publishing Options */}
            {isAdmin && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Publishing Options</h3>
                
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Published</FormLabel>
                        <FormDescription>
                          Make this learning path visible to all users
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured</FormLabel>
                        <FormDescription>
                          Highlight this path on the main dashboard
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Learning Path'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
