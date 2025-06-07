
export interface ContentFormData {
  type: string;
  topic: string;
  style: string;
  length: string;
  model: string;
  customPrompt: string;
  targetAudience?: string;
  businessContext?: string;
  useKnowledge?: boolean;
  tone?: string;
  industry?: string;
  purpose?: string;
}

export const contentTypes = [
  // Executive Content Types
  { value: 'executive-memo', label: 'Executive Memorandum', description: 'Strategic memos for C-suite and senior leadership' },
  { value: 'strategic-analysis', label: 'Strategic Analysis', description: 'Comprehensive business and market analysis' },
  { value: 'board-presentation', label: 'Board Presentation', description: 'Board-level presentation content and talking points' },
  { value: 'industry-insight', label: 'Industry Insight', description: 'Thought leadership and industry analysis' },
  { value: 'investor-communication', label: 'Investor Communication', description: 'Professional investor relations content' },
  
  // Professional Content Types
  { value: 'resume', label: 'Executive Resume', description: 'C-suite level resume with strategic accomplishments' },
  { value: 'cover-letter', label: 'Executive Cover Letter', description: 'Strategic cover letter for senior positions' },
  { value: 'linkedin-post', label: 'LinkedIn Thought Leadership', description: 'Executive-level social media content' },
  { value: 'email', label: 'Business Correspondence', description: 'Professional email communication' },
  { value: 'presentation', label: 'Executive Presentation', description: 'Strategic presentation content and frameworks' },
  { value: 'article', label: 'Thought Leadership Article', description: 'Industry expertise and strategic insights' },
];

export const styles = [
  { value: 'executive', label: 'Executive' },
  { value: 'strategic', label: 'Strategic' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'professional', label: 'Professional' },
  { value: 'authoritative', label: 'Authoritative' },
  { value: 'visionary', label: 'Visionary' },
  { value: 'consultative', label: 'Consultative' },
];

export const tones = [
  { value: 'confident', label: 'Confident & Decisive' },
  { value: 'collaborative', label: 'Collaborative' },
  { value: 'innovative', label: 'Innovative & Forward-thinking' },
  { value: 'data-driven', label: 'Data-driven & Analytical' },
  { value: 'inspirational', label: 'Inspirational & Motivating' },
  { value: 'pragmatic', label: 'Pragmatic & Results-focused' },
];

export const lengths = [
  { value: 'executive-summary', label: 'Executive Summary (1-2 key points)' },
  { value: 'short', label: 'Concise (2-3 paragraphs)' },
  { value: 'medium', label: 'Detailed (4-6 paragraphs)' },
  { value: 'comprehensive', label: 'Comprehensive (7+ paragraphs)' },
];

export const models = [
  { value: 'gpt-4o', label: 'GPT-4o (Premium Quality)' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast & Efficient)' },
];

export const targetAudiences = [
  { value: 'board-directors', label: 'Board of Directors' },
  { value: 'c-suite', label: 'C-Suite Executives' },
  { value: 'senior-leadership', label: 'Senior Leadership Team' },
  { value: 'investors', label: 'Investors & Stakeholders' },
  { value: 'industry-peers', label: 'Industry Peers' },
  { value: 'team-managers', label: 'Team & Department Managers' },
  { value: 'external-partners', label: 'External Partners & Clients' },
];

export const industries = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Financial Services' },
  { value: 'healthcare', label: 'Healthcare & Life Sciences' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'retail', label: 'Retail & Consumer Goods' },
  { value: 'energy', label: 'Energy & Utilities' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'telecommunications', label: 'Telecommunications' },
];

export const purposes = [
  { value: 'strategic-planning', label: 'Strategic Planning & Decision Making' },
  { value: 'stakeholder-communication', label: 'Stakeholder Communication' },
  { value: 'thought-leadership', label: 'Thought Leadership & Positioning' },
  { value: 'performance-reporting', label: 'Performance Reporting' },
  { value: 'change-management', label: 'Change Management' },
  { value: 'market-analysis', label: 'Market Analysis & Intelligence' },
  { value: 'investment-case', label: 'Investment Case & Funding' },
];
