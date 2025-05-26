
import { useUserProfile } from './useUserProfile';

export interface ProfileContext {
  personalInfo: string;
  careerGoals: string;
  learningPreferences: string;
  fullContext: string;
}

export function useProfileContext(): ProfileContext | null {
  const { profile } = useUserProfile();

  if (!profile) return null;

  const personalInfo = buildPersonalInfo(profile);
  const careerGoals = buildCareerGoals(profile);
  const learningPreferences = buildLearningPreferences(profile);
  
  const fullContext = [personalInfo, careerGoals, learningPreferences]
    .filter(Boolean)
    .join('\n\n');

  return {
    personalInfo,
    careerGoals,
    learningPreferences,
    fullContext,
  };
}

function buildPersonalInfo(profile: any): string {
  const parts = [];
  
  if (profile.full_name) {
    parts.push(`Name: ${profile.full_name}`);
  }
  
  if (profile.current_position && profile.company) {
    parts.push(`Current Role: ${profile.current_position} at ${profile.company}`);
  } else if (profile.current_position) {
    parts.push(`Current Role: ${profile.current_position}`);
  }
  
  if (profile.industry) {
    parts.push(`Industry: ${profile.industry}`);
  }
  
  if (profile.experience_level && profile.years_of_experience) {
    parts.push(`Experience: ${profile.experience_level} level with ${profile.years_of_experience} years`);
  }
  
  if (profile.management_level) {
    const managementText = profile.management_level.replace('_', ' ');
    parts.push(`Management Level: ${managementText}`);
  }
  
  if (profile.team_size && profile.team_size > 0) {
    parts.push(`Team Size: ${profile.team_size} people`);
  }
  
  if (profile.leadership_experience) {
    parts.push(`Has leadership experience`);
  }

  return parts.length > 0 ? `PROFESSIONAL BACKGROUND:\n${parts.join('\n')}` : '';
}

function buildCareerGoals(profile: any): string {
  const parts = [];
  
  if (profile.target_position) {
    parts.push(`Target Position: ${profile.target_position}`);
  }
  
  if (profile.target_industry) {
    parts.push(`Target Industry: ${profile.target_industry}`);
  }
  
  if (profile.target_salary_range) {
    const salaryText = profile.target_salary_range.replace('_', ' - $').replace('k', ',000');
    parts.push(`Target Salary: $${salaryText}`);
  }
  
  if (profile.career_goals && profile.career_goals.length > 0) {
    parts.push(`Goals: ${profile.career_goals.join(', ')}`);
  }
  
  if (profile.skill_gaps && profile.skill_gaps.length > 0) {
    parts.push(`Skill Gaps to Address: ${profile.skill_gaps.join(', ')}`);
  }
  
  if (profile.learning_priorities && profile.learning_priorities.length > 0) {
    parts.push(`Learning Priorities: ${profile.learning_priorities.join(', ')}`);
  }

  return parts.length > 0 ? `CAREER OBJECTIVES:\n${parts.join('\n')}` : '';
}

function buildLearningPreferences(profile: any): string {
  const parts = [];
  
  if (profile.learning_style) {
    const styleText = profile.learning_style.replace('_', '/');
    parts.push(`Learning Style: ${styleText}`);
  }
  
  if (profile.communication_style) {
    parts.push(`Communication Style: ${profile.communication_style}`);
  }
  
  if (profile.feedback_preference) {
    const feedbackText = profile.feedback_preference.replace('_', ' ');
    parts.push(`Feedback Preference: ${feedbackText}`);
  }
  
  if (profile.work_environment) {
    parts.push(`Work Environment: ${profile.work_environment}`);
  }
  
  if (profile.current_skills && profile.current_skills.length > 0) {
    parts.push(`Current Skills: ${profile.current_skills.join(', ')}`);
  }

  return parts.length > 0 ? `LEARNING PREFERENCES:\n${parts.join('\n')}` : '';
}
