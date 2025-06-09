
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AuditLogResult {
  action: string;
  resource_type: string;
  details: any;
  created_at: string;
}

export function useUserActivityContext() {
  const { user } = useAuth();

  const { data: recentActivity } = useQuery<AuditLogResult[]>({
    queryKey: ['recent-activity', user?.id],
    queryFn: async (): Promise<AuditLogResult[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('audit_logs')
        .select('action, resource_type, details, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const buildActivityContext = (): string => {
    if (!recentActivity || recentActivity.length === 0) return '';

    let context = `
=== RECENT ACTIVITY (Last 10 actions) ===
`;
    recentActivity.forEach(activity => {
      context += `• ${activity.action} on ${activity.resource_type} - ${new Date(activity.created_at).toLocaleDateString()}
`;
      if (activity.details) {
        const details = typeof activity.details === 'string' ? activity.details : JSON.stringify(activity.details);
        context += `  Details: ${details.substring(0, 100)}${details.length > 100 ? '...' : ''}
`;
      }
    });

    return context;
  };

  return {
    recentActivity,
    buildActivityContext,
    activityCount: recentActivity?.length || 0,
  };
}
