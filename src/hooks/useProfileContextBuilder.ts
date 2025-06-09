
import { useProfileContext } from './useProfileContext';

export function useProfileContextBuilder() {
  const { data: profileContext } = useProfileContext();

  const buildProfileContext = (): string => {
    if (!profileContext) return '';

    let context = `
=== USER PROFILE CONTEXT ===
Personal Information:
- Name: ${profileContext.full_name || 'Not specified'}
- Current Position: ${profileContext.current_position || 'Not specified'}
- Company: ${profileContext.company || 'Not specified'}
- Industry: ${profileContext.industry || 'Not specified'}
- Experience Level: ${profileContext.experience_level || 'Not specified'}
- Years of Experience: ${profileContext.years_of_experience || 'Not specified'}

Career Goals:
- Target Position: ${profileContext.target_position || 'Not specified'}
- Target Industry: ${profileContext.target_industry || 'Not specified'}
- Target Salary Range: ${profileContext.target_salary_range || 'Not specified'}
- Career Goals: ${profileContext.career_goals?.join(', ') || 'Not specified'}

Skills & Learning:
- Current Skills: ${profileContext.current_skills?.join(', ') || 'Not specified'}
- Skill Gaps: ${profileContext.skill_gaps?.join(', ') || 'Not specified'}
- Learning Priorities: ${profileContext.learning_priorities?.join(', ') || 'Not specified'}
- Learning Style: ${profileContext.learning_style || 'Not specified'}

Communication Preferences:
- Communication Style: ${profileContext.communication_style || 'Not specified'}
- Feedback Preference: ${profileContext.feedback_preference || 'Not specified'}
- Work Environment: ${profileContext.work_environment || 'Not specified'}
`;

    return context;
  };

  const buildProfileContextString = (): string => {
    return buildProfileContext();
  };

  return {
    buildProfileContext,
    buildProfileContextString,
    hasProfile: !!profileContext,
    hasProfileContext: !!profileContext,
  };
}
