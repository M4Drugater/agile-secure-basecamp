
import * as z from 'zod';

export const profileSchema = z.object({
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

export type ProfileFormData = z.infer<typeof profileSchema>;
