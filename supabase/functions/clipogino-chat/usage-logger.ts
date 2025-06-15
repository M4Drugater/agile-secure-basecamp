
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export class UsageLogger {
  private supabase = createClient(supabaseUrl, supabaseServiceKey);

  async logUsage(userId: string, model: string, usage: any, metadata: any = {}) {
    try {
      const cost = this.calculateCost(model, usage.prompt_tokens || 0, usage.completion_tokens || 0);
      
      await this.supabase.from('ai_usage_logs').insert({
        user_id: userId,
        function_name: 'clipogino-chat-elite',
        model_name: model,
        input_tokens: usage.prompt_tokens || 0,
        output_tokens: usage.completion_tokens || 0,
        total_cost: cost,
        request_duration: metadata.processingTime || 0,
        status: 'success',
        metadata: {
          current_page: metadata.currentPage || '/chat',
          context_quality: metadata.contextQuality || 'elite',
          personal_files_count: metadata.personalFilesCount || 0,
          response_length: metadata.responseLength || 0,
          prompt_version: metadata.promptVersion || 'elite-v2',
          strategic_advisory_level: 'fortune-500'
        }
      });

      console.log('Usage logged successfully:', {
        userId,
        model,
        cost: cost.toFixed(6),
        tokens: usage.total_tokens || 0
      });

    } catch (error) {
      console.error('Error logging usage:', error);
    }
  }

  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing = {
      'gpt-4o': { input: 0.000005, output: 0.000015 },
      'gpt-4o-mini': { input: 0.000001, output: 0.000003 }
    };
    
    const rates = pricing[model] || pricing['gpt-4o-mini'];
    return (inputTokens * rates.input) + (outputTokens * rates.output);
  }
}
