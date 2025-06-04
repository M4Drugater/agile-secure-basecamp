
export interface SyncResult {
  success: boolean;
  message?: string;
  results?: {
    products_created?: number;
    prices_created?: number;
    database_updated?: number;
    users_credits_initialized?: number;
    errors?: string[];
    stripe_products?: {
      [key: string]: {
        price_id: string;
        amount_eur: number;
      };
    };
  };
  error?: string;
  troubleshooting?: {
    stripe_configured?: boolean;
    supabase_configured?: boolean;
    common_solutions?: string[];
  };
}
