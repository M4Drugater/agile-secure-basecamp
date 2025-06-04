
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimplifiedAuthContext } from '@/contexts/SimplifiedAuthContext';

interface AuditLogEntry {
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: Record<string, any>;
}

export function useAuditLogger() {
  const { user } = useSimplifiedAuthContext();

  const logAction = useCallback(async (entry: AuditLogEntry) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: entry.action,
          resource_type: entry.resource_type,
          resource_id: entry.resource_id,
          details: entry.details || {},
          ip_address: null,
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Failed to log audit entry:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }, [user]);

  return { logAction };
}
