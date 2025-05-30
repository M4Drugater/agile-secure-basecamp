
import { useUserProfile } from './useUserProfile';

export function useProfileContext() {
  const { profile } = useUserProfile();

  if (!profile) return null;

  // Check if we have enough profile data for meaningful context
  const hasBasicInfo = profile.full_name && profile.current_position;
  const hasCareerInfo = profile.experience_level || profile.years_of_experience;
  const hasGoals = profile.target_position || profile.career_goals?.length;
  
  // Only return context if we have meaningful data
  if (!hasBasicInfo && !hasCareerInfo && !hasGoals) return null;

  // Build the full context string
  const contextParts = [];
  
  if (profile.full_name) {
    contextParts.push(`USER PROFILE: ${profile.full_name}`);
  }
  
  if (profile.current_position || profile.company) {
    const position = profile.current_position || 'Professional';
    const company = profile.company ? ` at ${profile.company}` : '';
    contextParts.push(`CURRENT ROLE: ${position}${company}`);
  }
  
  if (profile.industry) {
    contextParts.push(`INDUSTRY: ${profile.industry}`);
  }
  
  if (profile.experience_level && profile.years_of_experience) {
    contextParts.push(`EXPERIENCE: ${profile.experience_level} level with ${profile.years_of_experience} years`);
  } else if (profile.experience_level) {
    contextParts.push(`EXPERIENCE LEVEL: ${profile.experience_level}`);
  } else if (profile.years_of_experience) {
    contextParts.push(`YEARS OF EXPERIENCE: ${profile.years_of_experience}`);
  }
  
  if (profile.management_level && profile.management_level !== 'individual_contributor') {
    const teamInfo = profile.team_size ? ` managing ${profile.team_size} people` : '';
    contextParts.push(`MANAGEMENT: ${profile.management_level}${teamInfo}`);
  }
  
  if (profile.target_position) {
    contextParts.push(`CAREER GOAL: Aspiring to become ${profile.target_position}`);
  }
  
  if (profile.career_goals && profile.career_goals.length > 0) {
    contextParts.push(`CAREER OBJECTIVES: ${profile.career_goals.join(', ')}`);
  }
  
  if (profile.current_skills && profile.current_skills.length > 0) {
    contextParts.push(`CURRENT SKILLS: ${profile.current_skills.join(', ')}`);
  }
  
  if (profile.skill_gaps && profile.skill_gaps.length > 0) {
    contextParts.push(`SKILL GAPS: ${profile.skill_gaps.join(', ')}`);
  }
  
  if (profile.learning_priorities && profile.learning_priorities.length > 0) {
    contextParts.push(`LEARNING PRIORITIES: ${profile.learning_priorities.join(', ')}`);
  }
  
  if (profile.learning_style) {
    contextParts.push(`LEARNING STYLE: ${profile.learning_style}`);
  }
  
  if (profile.communication_style) {
    contextParts.push(`COMMUNICATION STYLE: ${profile.communication_style}`);
  }
  
  if (profile.feedback_preference) {
    contextParts.push(`FEEDBACK PREFERENCE: ${profile.feedback_preference}`);
  }
  
  if (profile.work_environment) {
    contextParts.push(`WORK ENVIRONMENT: ${profile.work_environment}`);
  }

  const fullContext = contextParts.length > 0 ? `\n\nUSER PERSONALIZATION CONTEXT:\n${contextParts.join('\n')}\n` : '';

  return {
    fullName: profile.full_name,
    currentPosition: profile.current_position,
    company: profile.company,
    industry: profile.industry,
    experienceLevel: profile.experience_level,
    yearsOfExperience: profile.years_of_experience,
    managementLevel: profile.management_level,
    teamSize: profile.team_size,
    leadershipExperience: profile.leadership_experience,
    targetPosition: profile.target_position,
    targetIndustry: profile.target_industry,
    targetSalaryRange: profile.target_salary_range,
    careerGoals: profile.career_goals,
    currentSkills: profile.current_skills,
    skillGaps: profile.skill_gaps,
    learningPriorities: profile.learning_priorities,
    learningStyle: profile.learning_style,
    communicationStyle: profile.communication_style,
    feedbackPreference: profile.feedback_preference,
    workEnvironment: profile.work_environment,
    certifications: profile.certifications,
    fullContext, // Add the formatted context string
  };
}
