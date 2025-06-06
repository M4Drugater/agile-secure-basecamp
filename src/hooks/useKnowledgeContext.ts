import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useSystemKnowledge } from './useSystemKnowledge';
import { useDownloadableResources } from './useDownloadableResources';
import { useProfileContext } from './useProfileContext';

export function useKnowledgeContext() {
  const { files: personalFiles } = useUserKnowledgeFiles();
  const { documents: systemDocuments } = useSystemKnowledge();
  const { resources } = useDownloadableResources();
  const { data: profileContext } = useProfileContext();

  const buildKnowledgeContext = async (userMessage: string): Promise<string> => {
    const searchTerms = userMessage.toLowerCase().split(' ').filter(term => term.length > 3);
    let context = '';

    // Add user profile context for personalization
    if (profileContext) {
      context += '\n\n=== USER PROFILE CONTEXT ===\n';
      context += `Name: ${profileContext.full_name || 'User'}\n`;
      context += `Position: ${profileContext.current_position || 'Not specified'}\n`;
      context += `Company: ${profileContext.company || 'Not specified'}\n`;
      context += `Industry: ${profileContext.industry || 'Not specified'}\n`;
      context += `Experience Level: ${profileContext.experience_level || 'Not specified'}\n`;
      if (profileContext.years_of_experience) {
        context += `Years of Experience: ${profileContext.years_of_experience}\n`;
      }
      if (profileContext.current_skills?.length) {
        context += `Skills: ${profileContext.current_skills.join(', ')}\n`;
      }
      if (profileContext.career_goals?.length) {
        context += `Career Goals: ${profileContext.career_goals.join(', ')}\n`;
      }
      if (profileContext.learning_priorities?.length) {
        context += `Learning Priorities: ${profileContext.learning_priorities.join(', ')}\n`;
      }
      context += `Communication Style: ${profileContext.communication_style || 'adaptive'}\n`;
    }

    // Search personal knowledge (all files, including uploaded documents)
    const personalFilesForSearch = personalFiles?.filter(file => file.document_category === 'personal') || [];
    const relevantPersonalFiles = personalFilesForSearch.filter(file => 
      searchTerms.some(term => 
        file.title.toLowerCase().includes(term) ||
        file.content?.toLowerCase().includes(term) ||
        file.description?.toLowerCase().includes(term) ||
        file.extracted_content?.toLowerCase().includes(term) ||
        file.ai_summary?.toLowerCase().includes(term) ||
        file.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        file.ai_key_points?.some(point => point.toLowerCase().includes(term))
      )
    );

    // Search system knowledge - including both tables
    // First, standard system knowledge documents
    const relevantSystemDocs = systemDocuments?.filter(doc =>
      searchTerms.some(term =>
        doc.title.toLowerCase().includes(term) ||
        doc.content.toLowerCase().includes(term) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        doc.category?.toLowerCase().includes(term)
      )
    ) || [];
    
    // Also get personal files marked as system
    const systemCategoryFiles = personalFiles?.filter(file => 
      file.document_category === 'system' &&
      searchTerms.some(term => 
        file.title.toLowerCase().includes(term) ||
        file.content?.toLowerCase().includes(term) ||
        file.description?.toLowerCase().includes(term) ||
        file.extracted_content?.toLowerCase().includes(term) ||
        file.ai_summary?.toLowerCase().includes(term) ||
        file.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        file.ai_key_points?.some(point => point.toLowerCase().includes(term))
      )
    ) || [];

    // Build context string with all relevant knowledge
    if (relevantPersonalFiles.length > 0) {
      context += '\n\n=== PERSONAL KNOWLEDGE BASE ===\n';
      relevantPersonalFiles.slice(0, 5).forEach(file => {
        context += `\n**${file.title}**\n`;
        if (file.ai_summary) {
          context += `AI Summary: ${file.ai_summary}\n`;
        }
        if (file.description) {
          context += `Description: ${file.description}\n`;
        }
        if (file.extracted_content && file.extracted_content !== file.content) {
          context += `Extracted Content: ${file.extracted_content.substring(0, 800)}...\n`;
        } else if (file.content) {
          context += `Content: ${file.content.substring(0, 800)}...\n`;
        }
        if (file.ai_key_points && file.ai_key_points.length > 0) {
          context += `Key Points: ${file.ai_key_points.join('; ')}\n`;
        }
        if (file.tags && file.tags.length > 0) {
          context += `Tags: ${file.tags.join(', ')}\n`;
        }
        context += `Source: ${file.source_type || 'manual'} | Processed: ${file.is_ai_processed ? 'Yes' : 'No'}\n`;
      });
    }

    // Combine both types of system knowledge
    const allSystemKnowledge = [
      ...relevantSystemDocs,
      ...systemCategoryFiles.map(file => ({
        id: file.id,
        title: file.title,
        content: file.content || file.extracted_content || file.ai_summary || file.description || '',
        category: 'User Contributed',
        tags: file.tags
      }))
    ];

    if (allSystemKnowledge.length > 0) {
      context += '\n\n=== SYSTEM KNOWLEDGE BASE ===\n';
      allSystemKnowledge.slice(0, 5).forEach(doc => {
        context += `\n**${doc.title}** (${doc.category || 'System Knowledge'})\n`;
        context += `${doc.content.substring(0, 1000)}...\n`;
        if (doc.tags && doc.tags.length > 0) {
          context += `Tags: ${doc.tags.join(', ')}\n`;
        }
        context += `Priority: ${doc.priority || 5}/10 | Usage: ${doc.usage_count || 0}\n`;
      });
    }

    // Also include broader context from all uploaded files
    const allUploadedFiles = personalFiles?.filter(file => file.file_url && file.is_ai_processed) || [];
    if (allUploadedFiles.length > 0 && relevantPersonalFiles.length < 3) {
      context += '\n\n=== ADDITIONAL UPLOADED DOCUMENTS ===\n';
      allUploadedFiles
        .filter(file => !relevantPersonalFiles.includes(file))
        .slice(0, 2)
        .forEach(file => {
          context += `\n**${file.title}** (${file.original_file_name || 'uploaded file'})\n`;
          if (file.ai_summary) {
            context += `Summary: ${file.ai_summary}\n`;
          }
          if (file.ai_key_points && file.ai_key_points.length > 0) {
            context += `Key Insights: ${file.ai_key_points.slice(0, 3).join('; ')}\n`;
          }
        });
    }

    return context;
  };

  const getKnowledgeRecommendations = async (userMessage: string) => {
    const searchTerms = userMessage.toLowerCase().split(' ').filter(term => term.length > 3);
    
    // Get relevant personal files (including all uploaded documents)
    const relevantPersonalFiles = personalFiles?.filter(file => 
      searchTerms.some(term => 
        file.title.toLowerCase().includes(term) ||
        file.content?.toLowerCase().includes(term) ||
        file.extracted_content?.toLowerCase().includes(term) ||
        file.ai_summary?.toLowerCase().includes(term) ||
        file.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    ).slice(0, 4) || [];

    // Get relevant system documents
    const relevantSystemDocs = systemDocuments?.filter(doc =>
      searchTerms.some(term =>
        doc.title.toLowerCase().includes(term) ||
        doc.content.toLowerCase().includes(term) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    ).slice(0, 3) || [];

    // Get relevant resources
    const relevantResources = resources?.filter(resource =>
      searchTerms.some(term =>
        resource.title.toLowerCase().includes(term) ||
        resource.description?.toLowerCase().includes(term) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    ).slice(0, 2) || [];

    return [
      ...relevantPersonalFiles.map(file => ({ ...file, type: 'personal' })),
      ...relevantSystemDocs.map(doc => ({ ...doc, type: 'system' })),
      ...relevantResources.map(resource => ({ ...resource, type: 'resource' }))
    ];
  };

  return {
    buildKnowledgeContext,
    getKnowledgeRecommendations,
    personalFilesCount: personalFiles?.filter(f => f.document_category === 'personal').length || 0,
    systemDocsCount: (
      (systemDocuments?.length || 0) + 
      (personalFiles?.filter(f => f.document_category === 'system').length || 0)
    ),
    resourcesCount: resources?.length || 0,
    uploadedFilesCount: personalFiles?.filter(file => file.file_url).length || 0,
    processedFilesCount: personalFiles?.filter(file => file.is_ai_processed).length || 0,
  };
}
