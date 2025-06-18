
import { Database } from '@/integrations/supabase/types';

// Extend the profiles table type to include preferred_language
export type ExtendedProfile = Database['public']['Tables']['profiles']['Row'] & {
  preferred_language?: 'en' | 'es' | 'it';
};

// Export the Language type for consistency
export type Language = 'en' | 'es' | 'it';
