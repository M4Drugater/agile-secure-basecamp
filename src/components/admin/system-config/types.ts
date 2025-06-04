
import { Database } from '@/integrations/supabase/types';

export type SystemConfig = Database['public']['Tables']['system_config']['Row'];
export type SystemConfigInsert = Database['public']['Tables']['system_config']['Insert'];
export type SystemConfigUpdate = Database['public']['Tables']['system_config']['Update'];

export interface NewConfigState {
  key: string;
  value: string;
  description: string;
  is_public: boolean;
}
