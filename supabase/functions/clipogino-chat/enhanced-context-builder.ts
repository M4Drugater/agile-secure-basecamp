
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { UserContext } from './elite-prompt-system.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export class EnhancedContextBuilder {
  private supabase = createClient(supabaseUrl, supabaseServiceKey);

  async buildUserContext(userId: string, currentPage: string = '/chat'): Promise<UserContext> {
    try {
      // Get comprehensive user profile
      const profile = await this.getUserProfile(userId);
      
      // Get knowledge metrics and insights
      const knowledge = await this.getKnowledgeContext(userId);
      
      // Get recent activity and achievements
      const activity = await this.getActivityContext(userId);
      
      // Build session context
      const session = {
        current_page: currentPage,
        previous_interactions: activity.conversation_count,
        conversation_tone: profile?.communication_style || 'professional',
        preferred_communication_style: profile?.communication_style || 'strategic and direct'
      };

      return {
        profile: {
          name: profile?.full_name || 'Professional',
          position: profile?.current_position || 'Executive',
          company: profile?.company || 'Organization',
          industry: profile?.industry || 'Business',
          experience_level: profile?.experience_level || 'Experienced',
          years_experience: profile?.years_of_experience || 5,
          career_goals: profile?.career_goals || ['Executive Leadership'],
          current_skills: profile?.current_skills || ['Strategic Thinking'],
          skill_gaps: profile?.skill_gaps || ['Advanced Leadership'],
          leadership_experience: profile?.leadership_experience || false,
          management_level: profile?.management_level || 'Individual Contributor'
        },
        knowledge,
        activity,
        session
      };
    } catch (error) {
      console.error('Error building user context:', error);
      return this.getDefaultContext(currentPage);
    }
  }

  private async getUserProfile(userId: string) {
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return profile;
  }

  private async getKnowledgeContext(userId: string) {
    // Get personal knowledge files
    const { data: personalFiles } = await this.supabase
      .from('user_knowledge_files')
      .select('title, ai_summary, ai_key_points, created_at')
      .eq('user_id', userId)
      .eq('processing_status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get system knowledge count
    const { count: systemCount } = await this.supabase
      .from('system_knowledge_base')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const recentUploads = personalFiles?.slice(0, 3).map(f => f.title) || [];
    const keyInsights = personalFiles?.flatMap(f => f.ai_key_points || []).slice(0, 5) || [];

    return {
      personal_files_count: personalFiles?.length || 0,
      system_knowledge_count: systemCount || 0,
      recent_uploads: recentUploads,
      key_insights: keyInsights
    };
  }

  private async getActivityContext(userId: string) {
    // Get recent conversations
    const { data: conversations } = await this.supabase
      .from('chat_messages')
      .select('content, created_at')
      .eq('user_id', userId)
      .eq('role', 'user')
      .order('created_at', { ascending: false })
      .limit(5);

    // Get content creation metrics
    const { count: contentCount } = await this.supabase
      .from('content_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get learning progress
    const { data: learningProgress } = await this.supabase
      .from('user_learning_progress')
      .select('status, progress_percentage')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(3);

    const recentConversations = conversations?.map(c => 
      c.content.substring(0, 100) + (c.content.length > 100 ? '...' : '')
    ) || [];

    const learningStatus = learningProgress?.map(lp => 
      `${lp.status} (${lp.progress_percentage}%)`
    ) || [];

    return {
      recent_conversations: recentConversations,
      content_created: contentCount || 0,
      learning_progress: learningStatus,
      last_achievements: ['Recent platform engagement', 'Knowledge base expansion'],
      conversation_count: conversations?.length || 0
    };
  }

  private getDefaultContext(currentPage: string): UserContext {
    return {
      profile: {
        name: 'Professional',
        position: 'Executive',
        company: 'Organization',
        industry: 'Business',
        experience_level: 'Experienced',
        years_experience: 5,
        career_goals: ['Executive Leadership', 'Strategic Growth'],
        current_skills: ['Strategic Thinking', 'Team Leadership'],
        skill_gaps: ['Advanced Leadership', 'Digital Transformation'],
        leadership_experience: false,
        management_level: 'Individual Contributor'
      },
      knowledge: {
        personal_files_count: 0,
        system_knowledge_count: 0,
        recent_uploads: [],
        key_insights: []
      },
      activity: {
        recent_conversations: [],
        content_created: 0,
        learning_progress: [],
        last_achievements: [],
        conversation_count: 0
      },
      session: {
        current_page: currentPage,
        previous_interactions: 0,
        conversation_tone: 'professional',
        preferred_communication_style: 'strategic and direct'
      }
    };
  }
}
