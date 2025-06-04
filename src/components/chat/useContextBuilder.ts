
import { useProfileContext } from '@/hooks/useProfileContext';
import { useKnowledgeContext } from '@/hooks/useKnowledgeContext';

export function useContextBuilder() {
  const profileContext = useProfileContext();
  const { buildKnowledgeContext } = useKnowledgeContext();

  const buildFullContext = async (userMessage: string): Promise<string> => {
    // Build profile context string from profile data
    let fullContext = '';
    if (profileContext.data) {
      const profile = profileContext.data;
      fullContext = `User Profile Context:
- Name: ${profile.full_name || 'Not specified'}
- Position: ${profile.current_position || 'Not specified'}
- Company: ${profile.company || 'Not specified'}
- Industry: ${profile.industry || 'Not specified'}
- Experience Level: ${profile.experience_level || 'Not specified'}
- Years of Experience: ${profile.years_of_experience || 'Not specified'}
- Management Level: ${profile.management_level || 'Not specified'}
- Team Size: ${profile.team_size || 'Not specified'}
- Leadership Experience: ${profile.leadership_experience ? 'Yes' : 'No'}
- Target Position: ${profile.target_position || 'Not specified'}
- Target Industry: ${profile.target_industry || 'Not specified'}
- Target Salary Range: ${profile.target_salary_range || 'Not specified'}
- Learning Style: ${profile.learning_style || 'Not specified'}
- Communication Style: ${profile.communication_style || 'Not specified'}
- Feedback Preference: ${profile.feedback_preference || 'Not specified'}
- Work Environment: ${profile.work_environment || 'Not specified'}
- Career Goals: ${profile.career_goals?.join(', ') || 'Not specified'}
- Current Skills: ${profile.current_skills?.join(', ') || 'Not specified'}
- Skill Gaps: ${profile.skill_gaps?.join(', ') || 'Not specified'}
- Learning Priorities: ${profile.learning_priorities?.join(', ') || 'Not specified'}
- Certifications: ${profile.certifications?.join(', ') || 'Not specified'}

`;
    }
    
    // Add knowledge context if available
    const knowledgeContext = await buildKnowledgeContext(userMessage);
    if (knowledgeContext) {
      fullContext += knowledgeContext;
    }
    
    return fullContext;
  };

  const hasProfileContext = !!profileContext.data;

  return {
    buildFullContext,
    hasProfileContext,
  };
}
