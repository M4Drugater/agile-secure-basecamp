
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://jzvpgqtobzqbavsillqp.supabase.co';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export class CreditGuard {
  static async checkAndConsumeCredits(
    userId: string,
    creditsNeeded: number,
    functionName: string,
    description: string = 'AI function usage'
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const { data: canConsume, error } = await supabase
        .rpc('consume_credits', {
          user_uuid: userId,
          credits_to_consume: creditsNeeded,
          function_name: functionName,
          description_text: description
        });

      if (error) {
        console.error('Credit consumption error:', error);
        return { allowed: false, reason: 'Credit system error' };
      }

      if (!canConsume) {
        return { 
          allowed: false, 
          reason: 'Insufficient credits or daily limit exceeded' 
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Credit guard error:', error);
      return { allowed: false, reason: 'Credit system error' };
    }
  }

  static async getUserCreditStatus(userId: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_credit_status', { user_uuid: userId });

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error getting credit status:', error);
      return null;
    }
  }

  // Convert token usage to credits (1 credit = ~1000 tokens)
  static tokensToCredits(inputTokens: number, outputTokens: number): number {
    const totalTokens = inputTokens + (outputTokens * 2); // Output tokens cost more
    return Math.ceil(totalTokens / 1000);
  }
}
