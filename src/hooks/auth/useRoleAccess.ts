
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function useRoleAccess(profile: Profile | null) {
  const hasRole = (role: string) => {
    if (!profile) return false;
    return profile.role === role || 
           (role === 'user' && ['admin', 'super_admin'].includes(profile.role)) ||
           (role === 'admin' && profile.role === 'super_admin');
  };

  const isAdmin = () => hasRole('admin');
  const isSuperAdmin = () => profile?.role === 'super_admin';
  const isUser = () => hasRole('user');

  return {
    hasRole,
    isAdmin,
    isSuperAdmin,
    isUser
  };
}
