
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export interface UserProfile {
  full_name?: string;
  current_position?: string;
  company?: string;
  industry?: string;
  experience_level?: string;
  years_of_experience?: number;
  current_skills?: string[];
  career_goals?: string[];
  communication_style?: string;
}

export class KnowledgeContextBuilder {
  private supabase = createClient(supabaseUrl, supabaseServiceKey);

  async buildContext(message: string, userId: string): Promise<string> {
    let knowledgeContext = '';

    try {
      // Get user profile for personalization
      const profile = await this.getUserProfile(userId);
      if (profile) {
        knowledgeContext += this.buildProfileContext(profile);
      }

      // Get personal knowledge files
      const personalContext = await this.getPersonalKnowledgeContext(message, userId);
      if (personalContext) {
        knowledgeContext += personalContext;
      }

      // Get system knowledge
      const systemContext = await this.getSystemKnowledgeContext(message);
      if (systemContext) {
        knowledgeContext += systemContext;
      }

    } catch (contextError) {
      console.error('Error building knowledge context:', contextError);
    }

    return knowledgeContext;
  }

  private async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return profile;
  }

  private buildProfileContext(profile: UserProfile): string {
    let context = '\n=== USER PROFILE ===\n';
    context += `Name: ${profile.full_name || 'User'}\n`;
    context += `Position: ${profile.current_position || 'Not specified'}\n`;
    context += `Company: ${profile.company || 'Not specified'}\n`;
    context += `Industry: ${profile.industry || 'Not specified'}\n`;
    context += `Experience: ${profile.experience_level || 'Not specified'}`;
    if (profile.years_of_experience) context += ` (${profile.years_of_experience} years)`;
    context += `\n`;
    if (profile.current_skills?.length) {
      context += `Skills: ${profile.current_skills.join(', ')}\n`;
    }
    if (profile.career_goals?.length) {
      context += `Goals: ${profile.career_goals.join(', ')}\n`;
    }
    context += `Communication Style: ${profile.communication_style || 'adaptive'}\n`;
    
    return context;
  }

  private async getPersonalKnowledgeContext(message: string, userId: string): Promise<string> {
    const { data: personalFiles } = await this.supabase
      .from('user_knowledge_files')
      .select('*')
      .eq('user_id', userId)
      .eq('processing_status', 'completed')
      .order('updated_at', { ascending: false });

    if (!personalFiles || personalFiles.length === 0) return '';

    const searchTerms = message.toLowerCase().split(' ').filter(term => term.length > 3);
    const relevantFiles = personalFiles.filter(file => 
      searchTerms.some(term => 
        file.title.toLowerCase().includes(term) ||
        file.content?.toLowerCase().includes(term) ||
        file.extracted_content?.toLowerCase().includes(term) ||
        file.ai_summary?.toLowerCase().includes(term) ||
        file.description?.toLowerCase().includes(term) ||
        file.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        file.ai_key_points?.some(point => point.toLowerCase().includes(term))
      )
    ).slice(0, 5);

    if (relevantFiles.length === 0) {
      // Include recent uploads even if not directly relevant
      const recentUploads = personalFiles
        .filter(file => file.file_url && file.is_ai_processed)
        .slice(0, 2);

      if (recentUploads.length > 0) {
        let context = '\n=== RECENT UPLOADS CONTEXT ===\n';
        recentUploads.forEach(file => {
          context += `${file.title}: ${file.ai_summary || file.description || 'Uploaded document'}\n`;
        });
        return context;
      }
      return '';
    }

    let context = '\n=== RELEVANT PERSONAL KNOWLEDGE ===\n';
    relevantFiles.forEach(file => {
      context += `\n**${file.title}**\n`;
      if (file.ai_summary) {
        context += `Summary: ${file.ai_summary}\n`;
      }
      if (file.description) {
        context += `Description: ${file.description}\n`;
      }
      if (file.extracted_content) {
        context += `Content: ${file.extracted_content.substring(0, 1000)}...\n`;
      } else if (file.content) {
        context += `Content: ${file.content.substring(0, 1000)}...\n`;
      }
      if (file.ai_key_points?.length) {
        context += `Key Points: ${file.ai_key_points.join('; ')}\n`;
      }
      if (file.tags?.length) {
        context += `Tags: ${file.tags.join(', ')}\n`;
      }
      context += `Source: ${file.source_type || 'manual'} | File: ${file.original_file_name || 'manual entry'}\n`;
    });

    return context;
  }

  private async getSystemKnowledgeContext(message: string): Promise<string> {
    // Get system knowledge from system_knowledge_base table
    const { data: systemKnowledge } = await this.supabase
      .from('system_knowledge_base')
      .select('*')
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(10);

    // Get system knowledge from user_knowledge_files that are marked as system
    const { data: userSystemKnowledge } = await this.supabase
      .from('user_knowledge_files')
      .select('*')
      .eq('document_category', 'system')
      .eq('processing_status', 'completed')
      .order('updated_at', { ascending: false })
      .limit(10);

    // Combine and process both types of system knowledge
    const allSystemKnowledge = [
      ...(systemKnowledge || []),
      ...(userSystemKnowledge || []).map(file => ({
        id: file.id,
        title: file.title,
        content: file.content || file.extracted_content || file.ai_summary || file.description || '',
        category: 'User Contributed',
        tags: file.tags
      }))
    ];

    if (!allSystemKnowledge || allSystemKnowledge.length === 0) return '';

    const searchTerms = message.toLowerCase().split(' ').filter(term => term.length > 3);
    const relevantSystemDocs = allSystemKnowledge.filter(doc =>
      searchTerms.some(term =>
        doc.title.toLowerCase().includes(term) ||
        doc.content.toLowerCase().includes(term) ||
        (doc.category && doc.category.toLowerCase().includes(term)) ||
        doc.tags?.some(tag => tag.toLowerCase().includes(term))
      )
    ).slice(0, 3);

    if (relevantSystemDocs.length === 0) return '';

    let context = '\n\n=== RELEVANT SYSTEM KNOWLEDGE ===\n';
    relevantSystemDocs.forEach(doc => {
      context += `\n**${doc.title}** (${doc.category || 'System Knowledge'})\n`;
      context += `${doc.content.substring(0, 800)}...\n`;
      if (doc.tags?.length) {
        context += `Tags: ${doc.tags.join(', ')}\n`;
      }
    });

    return context;
  }
}
