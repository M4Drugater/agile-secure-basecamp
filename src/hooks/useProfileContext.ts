
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
  };
}
