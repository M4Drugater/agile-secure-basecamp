
export interface ContentFormData {
  type: string;
  topic: string;
  style: string;
  length: string;
  model: string;
  customPrompt?: string;
  targetAudience?: string;
  businessContext?: string;
  useKnowledge?: boolean;
  tone?: string;
  industry?: string;
  purpose?: string;
}

export const contentTypes = [
  { 
    value: 'executive-memo', 
    label: 'Executive Memorandum',
    description: 'Strategic C-suite communication'
  },
  { 
    value: 'strategic-analysis', 
    label: 'Strategic Analysis',
    description: 'Business strategy and market analysis'
  },
  { 
    value: 'board-presentation', 
    label: 'Board Presentation',
    description: 'Board-level strategic presentation'
  },
  { 
    value: 'industry-insight', 
    label: 'Industry Insights',
    description: 'Thought leadership content'
  },
  { 
    value: 'investor-communication', 
    label: 'Investor Communication',
    description: 'Investor relations materials'
  },
  { 
    value: 'resume', 
    label: 'Executive Resume',
    description: 'C-suite level resume'
  },
  { 
    value: 'cover-letter', 
    label: 'Executive Cover Letter',
    description: 'Senior position application letter'
  },
  { 
    value: 'linkedin-post', 
    label: 'LinkedIn Post',
    description: 'Professional thought leadership post'
  },
  { 
    value: 'email', 
    label: 'Business Email',
    description: 'Professional business communication'
  },
  { 
    value: 'presentation', 
    label: 'Business Presentation',
    description: 'Strategic business presentation'
  },
  { 
    value: 'article', 
    label: 'Business Article',
    description: 'Industry thought leadership article'
  },
];

export const styles = [
  { value: 'executive', label: 'Executive' },
  { value: 'professional', label: 'Professional' },
  { value: 'strategic', label: 'Strategic' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'consultative', label: 'Consultative' },
  { value: 'thought-leadership', label: 'Thought Leadership' },
];

export const tones = [
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'collaborative', label: 'Collaborative' },
  { value: 'visionary', label: 'Visionary' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'inspiring', label: 'Inspiring' },
  { value: 'pragmatic', label: 'Pragmatic' },
];

export const lengths = [
  { value: 'brief', label: 'Brief (100-300 words)' },
  { value: 'short', label: 'Short (300-500 words)' },
  { value: 'medium', label: 'Medium (500-1000 words)' },
  { value: 'long', label: 'Long (1000-2000 words)' },
  { value: 'comprehensive', label: 'Comprehensive (2000+ words)' },
];

export const models = [
  { value: 'gpt-4o', label: 'GPT-4o (Premium)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
];

export const targetAudiences = [
  { value: 'c-suite-executives', label: 'C-Suite Executives' },
  { value: 'board-members', label: 'Board Members' },
  { value: 'senior-management', label: 'Senior Management' },
  { value: 'investors', label: 'Investors & Stakeholders' },
  { value: 'industry-peers', label: 'Industry Peers' },
  { value: 'employees', label: 'Company Employees' },
  { value: 'customers', label: 'Enterprise Customers' },
  { value: 'media', label: 'Media & Press' },
];

export const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'financial-services', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'automotive', label: 'Automotive' },
];

export const purposes = [
  { value: 'strategic-communication', label: 'Strategic Communication' },
  { value: 'decision-making', label: 'Decision Making Support' },
  { value: 'stakeholder-engagement', label: 'Stakeholder Engagement' },
  { value: 'thought-leadership', label: 'Thought Leadership' },
  { value: 'change-management', label: 'Change Management' },
  { value: 'performance-reporting', label: 'Performance Reporting' },
  { value: 'business-development', label: 'Business Development' },
  { value: 'risk-management', label: 'Risk Management' },
];
