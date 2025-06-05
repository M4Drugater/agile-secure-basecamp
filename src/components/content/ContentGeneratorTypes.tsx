
export interface ContentFormData {
  type: string;
  topic: string;
  style: string;
  length: string;
  model: string;
  customPrompt: string;
}

export const contentTypes = [
  { value: 'resume', label: 'Resume', description: 'Professional resume with work experience and skills' },
  { value: 'cover-letter', label: 'Cover Letter', description: 'Personalized cover letter for job applications' },
  { value: 'linkedin-post', label: 'LinkedIn Post', description: 'Professional social media content' },
  { value: 'email', label: 'Professional Email', description: 'Business correspondence and communication' },
  { value: 'presentation', label: 'Presentation Outline', description: 'Structured presentation content' },
  { value: 'article', label: 'Article', description: 'Professional articles and thought leadership' },
];

export const styles = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formal' },
  { value: 'creative', label: 'Creative' },
  { value: 'technical', label: 'Technical' },
];

export const lengths = [
  { value: 'short', label: 'Short (1-2 paragraphs)' },
  { value: 'medium', label: 'Medium (3-5 paragraphs)' },
  { value: 'long', label: 'Long (6+ paragraphs)' },
];

export const models = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Cost-effective)' },
  { value: 'gpt-4o', label: 'GPT-4o (Advanced)' },
];
