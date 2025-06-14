
import { useAuth } from '@/contexts/AuthContext';
import { useUserKnowledgeFiles } from '@/hooks/useUserKnowledgeFiles';
import { useSystemKnowledge } from '@/hooks/useSystemKnowledge';
import { useContentItems } from '@/hooks/useContentItems';

export function useCompetitiveContext() {
  const { profile } = useAuth();
  const { files: userKnowledgeFiles } = useUserKnowledgeFiles();
  const { documents: systemKnowledge } = useSystemKnowledge();
  const { contentItems } = useContentItems();

  const buildUserProfileContext = (): string => {
    if (!profile) return '';

    return `=== USER PROFILE CONTEXT ===
Name: ${profile.full_name || 'Not specified'}
Position: ${profile.current_position || 'Not specified'}
Company: ${profile.company || 'Not specified'}
Industry: ${profile.industry || 'Not specified'}
Experience Level: ${profile.experience_level || 'Not specified'}
Management Level: ${profile.management_level || 'Not specified'}
Years of Experience: ${profile.years_of_experience || 'Not specified'}
Team Size: ${profile.team_size || 'Not specified'}

Career Goals: ${profile.career_goals?.join(', ') || 'Not specified'}
Target Position: ${profile.target_position || 'Not specified'}
Target Industry: ${profile.target_industry || 'Not specified'}
Current Skills: ${profile.current_skills?.join(', ') || 'Not specified'}
Skill Gaps: ${profile.skill_gaps?.join(', ') || 'Not specified'}

Learning Style: ${profile.learning_style || 'Not specified'}
Communication Style: ${profile.communication_style || 'Not specified'}
Feedback Preference: ${profile.feedback_preference || 'Not specified'}
Work Environment: ${profile.work_environment || 'Not specified'}

`;
  };

  const buildKnowledgeContext = (): string => {
    let context = '';

    // Add user knowledge files
    if (userKnowledgeFiles && userKnowledgeFiles.length > 0) {
      context += '=== USER KNOWLEDGE BASE ===\n';
      userKnowledgeFiles.forEach(file => {
        if (file.content || file.ai_summary) {
          context += `Document: ${file.title}\n`;
          context += `Type: ${file.file_type || 'Unknown'}\n`;
          if (file.ai_summary) context += `Summary: ${file.ai_summary}\n`;
          if (file.ai_key_points?.length) context += `Key Points: ${file.ai_key_points.join(', ')}\n`;
          if (file.content) context += `Content: ${file.content.substring(0, 1000)}...\n`;
          context += '\n';
        }
      });
    }

    // Add system knowledge
    if (systemKnowledge && systemKnowledge.length > 0) {
      context += '=== SYSTEM KNOWLEDGE BASE ===\n';
      systemKnowledge.forEach(doc => {
        if (doc.content) {
          context += `Document: ${doc.title}\n`;
          context += `Category: ${doc.category}\n`;
          // Use title as summary since summary field doesn't exist in system_knowledge_base
          context += `Summary: ${doc.title}\n`;
          context += `Content: ${doc.content.substring(0, 1000)}...\n`;
          context += '\n';
        }
      });
    }

    return context;
  };

  const buildContentContext = (): string => {
    if (!contentItems || contentItems.length === 0) return '';

    let context = '=== USER CONTENT HISTORY ===\n';
    const recentContent = contentItems.slice(0, 10); // Last 10 pieces of content

    recentContent.forEach(item => {
      context += `Content: ${item.title}\n`;
      context += `Type: ${item.content_type}\n`;
      context += `Status: ${item.status}\n`;
      if (item.tags?.length) context += `Tags: ${item.tags.join(', ')}\n`;
      context += `Preview: ${item.content.substring(0, 200)}...\n`;
      context += '\n';
    });

    return context;
  };

  const buildFullCompetitiveContext = (sessionConfig: any): string => {
    let fullContext = buildUserProfileContext();
    fullContext += buildKnowledgeContext();
    fullContext += buildContentContext();

    // Add session-specific context
    if (sessionConfig.companyName || sessionConfig.industry || sessionConfig.analysisFocus) {
      fullContext += '=== CURRENT ANALYSIS CONTEXT ===\n';
      if (sessionConfig.companyName) fullContext += `Target Company: ${sessionConfig.companyName}\n`;
      if (sessionConfig.industry) fullContext += `Industry: ${sessionConfig.industry}\n`;
      if (sessionConfig.analysisFocus) fullContext += `Analysis Focus: ${sessionConfig.analysisFocus}\n`;
      if (sessionConfig.objectives) fullContext += `Objectives: ${sessionConfig.objectives}\n`;
      fullContext += '\n';
    }

    return fullContext;
  };

  return {
    buildUserProfileContext,
    buildKnowledgeContext,
    buildContentContext,
    buildFullCompetitiveContext,
  };
}
