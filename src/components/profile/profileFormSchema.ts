
import * as z from 'zod';

export const profileSchema = z.object({
  full_name: z.string().optional(),
  current_position: z.string().optional(),
  company: z.string().optional(),
  industry: z.enum(['technology', 'finance', 'healthcare', 'education', 'consulting', 'manufacturing', 'retail', 'other']).optional(),
  experience_level: z.enum(['entry', 'junior', 'mid', 'senior', 'lead', 'principal', 'executive']).optional(),
  years_of_experience: z.number().optional(),
  management_level: z.enum(['individual_contributor', 'team_lead', 'manager', 'senior_manager', 'director', 'vp', 'c_level']).optional(),
  team_size: z.number().optional(),
  leadership_experience: z.boolean().optional(),
  target_position: z.string().optional(),
  target_industry: z.string().optional(),
  target_salary_range: z.enum(['under_50k', '50k_75k', '75k_100k', '100k_150k', '150k_200k', '200k_300k', 'over_300k']).optional(),
  learning_style: z.enum(['visual', 'auditory', 'kinesthetic', 'reading_writing', 'mixed']).optional(),
  communication_style: z.enum(['direct', 'collaborative', 'analytical', 'supportive', 'formal', 'casual']).optional(),
  feedback_preference: z.enum(['frequent', 'structured', 'informal', 'written', 'verbal', 'peer_review']).optional(),
  work_environment: z.enum(['remote', 'hybrid', 'office', 'flexible', 'startup', 'corporate']).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
