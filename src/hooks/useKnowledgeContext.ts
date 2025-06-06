
import { useUserKnowledgeFiles } from './useUserKnowledgeFiles';
import { useSystemKnowledge } from './useSystemKnowledge';
import { useUserProfile } from './useUserProfile';

interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  priority?: number;
  usage_count?: number;
}

export function useKnowledgeContext() {
  const { files } = useUserKnowledgeFiles();
  const { documents } = useSystemKnowledge();
  const { profile } = useUserProfile();

  const buildContext = (message: string): string => {
    let context = '';

    // Add user profile context
    if (profile) {
      context += '=== USER PROFILE ===\n';
      if (profile.full_name) context += `Name: ${profile.full_name}\n`;
      if (profile.role) context += `Role: ${profile.role}\n`;
      if (profile.company) context += `Company: ${profile.company}\n`;
      if (profile.industry) context += `Industry: ${profile.industry}\n`;
      if (profile.experience_level) context += `Experience: ${profile.experience_level}\n`;
      if (profile.career_goals) context += `Goals: ${profile.career_goals}\n`;
      if (profile.learning_preferences) context += `Learning Style: ${profile.learning_preferences}\n`;
      context += '\n';
    }

    // Add personal knowledge files
    if (files && files.length > 0) {
      context += '=== PERSONAL KNOWLEDGE ===\n';
      const personalFiles = files.filter(file => 
        file.document_category === 'personal' || !file.document_category
      );
      
      personalFiles.forEach(file => {
        if (file.content || file.description) {
          context += `Title: ${file.title}\n`;
          if (file.description) context += `Description: ${file.description}\n`;
          if (file.content) context += `Content: ${file.content.substring(0, 500)}...\n`;
          if (file.tags && file.tags.length > 0) context += `Tags: ${file.tags.join(', ')}\n`;
          context += '\n';
        }
      });
    }

    // Add system knowledge
    if (documents && documents.length > 0) {
      context += '=== SYSTEM KNOWLEDGE ===\n';
      documents.forEach(doc => {
        if (doc.content) {
          context += `Title: ${doc.title}\n`;
          if (doc.description) context += `Description: ${doc.description}\n`;
          context += `Content: ${doc.content.substring(0, 500)}...\n`;
          if (doc.tags && doc.tags.length > 0) context += `Tags: ${doc.tags.join(', ')}\n`;
          context += '\n';
        }
      });
    }

    return context;
  };

  const getRelevantDocuments = (message: string, limit: number = 5): KnowledgeDocument[] => {
    const allDocs: KnowledgeDocument[] = [];
    
    // Add personal files
    if (files) {
      files.forEach(file => {
        if (file.content || file.description) {
          allDocs.push({
            id: file.id,
            title: file.title,
            content: file.content || file.description || '',
            category: 'personal',
            tags: file.tags || [],
          });
        }
      });
    }

    // Add system knowledge
    if (documents) {
      documents.forEach(doc => {
        if (doc.content) {
          allDocs.push({
            id: doc.id,
            title: doc.title,
            content: doc.content,
            category: 'system',
            tags: doc.tags || [],
          });
        }
      });
    }

    // Simple relevance scoring based on keyword matching
    const keywords = message.toLowerCase().split(' ');
    const scoredDocs = allDocs.map(doc => {
      let score = 0;
      const searchText = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) {
          score += 1;
        }
      });

      return { ...doc, score };
    });

    // Sort by score and return top results
    return scoredDocs
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  };

  const getDocumentsByCategory = (category: 'personal' | 'system'): KnowledgeDocument[] => {
    if (category === 'personal' && files) {
      return files
        .filter(file => (file.document_category === 'personal' || !file.document_category) && (file.content || file.description))
        .map(file => ({
          id: file.id,
          title: file.title,
          content: file.content || file.description || '',
          category: 'personal',
          tags: file.tags || [],
        }));
    }

    if (category === 'system' && documents) {
      return documents
        .filter(doc => doc.content)
        .map(doc => ({
          id: doc.id,
          title: doc.title,
          content: doc.content,
          category: 'system',
          tags: doc.tags || [],
        }));
    }

    return [];
  };

  const getTotalDocumentCount = (): number => {
    const personalCount = files?.filter(f => f.content || f.description).length || 0;
    const systemCount = documents?.filter(d => d.content).length || 0;
    return personalCount + systemCount;
  };

  return {
    buildContext,
    getRelevantDocuments,
    getDocumentsByCategory,
    getTotalDocumentCount,
    profile,
    personalFiles: files || [],
    systemDocuments: documents || [],
  };
}
