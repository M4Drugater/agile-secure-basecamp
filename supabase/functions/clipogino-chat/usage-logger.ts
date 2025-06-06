
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export interface UsageData {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export class UsageLogger {
  private supabase = createClient(supabaseUrl, supabaseServiceKey);

  async logUsage(
    userId: string,
    model: string,
    usage: UsageData
  ): Promise<void> {
    try {
      const costPer1000Tokens = model === 'gpt-4o' ? 0.005 : 0.0001;
      const totalCost = (usage.total_tokens * costPer1000Tokens) / 1000;
      
      await this.supabase.from('ai_usage_logs').insert({
        user_id: userId,
        model_name: model,
        function_name: 'clipogino-chat',
        input_tokens: usage.prompt_tokens,
        output_tokens: usage.completion_tokens,
        total_cost: totalCost,
        status: 'success'
      });
    } catch (logError) {
      console.error('Error logging usage:', logError);
    }
  }
}
