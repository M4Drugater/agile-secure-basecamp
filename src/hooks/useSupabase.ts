
import { useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export { supabase };

export function useSupabase() {
  const { user } = useAuth();
  
  return {
    supabase,
    user
  };
}
