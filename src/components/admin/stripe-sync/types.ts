
export interface SyncResult {
  success: boolean;
  message?: string;
  details?: {
    plans_created?: number;
    users_initialized?: number;
    stripe_products?: {
      pro?: { product_id: string; price_id: string; amount_eur: number };
      enterprise?: { product_id: string; price_id: string; amount_eur: number };
    };
    configuration?: {
      stripe_connected?: boolean;
      database_updated?: boolean;
      credits_initialized?: boolean;
      ai_pricing_updated?: boolean;
    };
  };
  error?: string;
  troubleshooting?: {
    stripe_key_configured?: boolean;
    supabase_configured?: boolean;
    common_solutions?: string[];
  };
}
