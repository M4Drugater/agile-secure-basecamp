
import { useProfileContext } from './useProfileContext';

export function useProfileContextBuilder() {
  const profileContext = useProfileContext();

  const buildProfileContextString = (): string => {
    if (!profileContext) return '';

    let context = `
=== USER PROFILE CONTEXT ===
Professional Background:
- Name: ${profileContext.full_name || 'Not specified'}
- Current Position: ${profileContext.current_position || 'Not specified'}
- Company: ${profileContext.company || 'Not specified'}
- Industry: ${profileContext.industry || 'Not specified'}
- Experience Level: ${profileContext.experience_level || 'Not specified'}
- Years of Experience: ${profileContext.years_of_experience || 'Not specified'}

Career Goals:
- Target Position: ${profileContext.target_position || 'Not specified'}
- Target Industry: ${profileContext.target_industry || 'Not specified'}
- Career Goals: ${profileContext.career_goals?.join(', ') || 'Not specified'}

Learning Preferences:
- Learning Style: ${profileContext.learning_style || 'Not specified'}
- Communication Style: ${profileContext.communication_style || 'Not specified'}
- Feedback Preference: ${profileContext.feedback_preference || 'Not specified'}
`;

    if (profileContext.current_skills?.length) {
      context += `\nCurrent Skills: ${profileContext.current_skills.join(', ')}`;
    }

    if (profileContext.skill_gaps?.length) {
      context += `\nSkill Gaps: ${profileContext.skill_gaps.join(', ')}`;
    }

    return context;
  };

  // Legacy method name for backward compatibility
  const buildProfileContext = buildProfileContextString;

  const hasProfileContext = !!profileContext;

  return {
    buildProfileContextString,
    buildProfileContext, // Legacy support
    hasProfileContext,
    hasProfile: hasProfileContext, // Alternative name
  };
}
