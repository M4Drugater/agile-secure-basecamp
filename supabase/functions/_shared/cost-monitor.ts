
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://jzvpgqtobzqbavsillqp.supabase.co';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export interface UsageLog {
  user_id: string;
  model_name: string;
  function_name: string;
  input_tokens: number;
  output_tokens: number;
  total_cost: number;
  request_duration?: number;
  status: 'success' | 'error' | 'timeout';
  error_message?: string;
}

export interface CostLimits {
  daily_limit: number;
  monthly_limit: number;
  per_user_daily_limit: number;
  circuit_breaker_threshold: number;
  is_active: boolean;
}

export interface ModelPricing {
  model_name: string;
  input_cost_per_token: number;
  output_cost_per_token: number;
}

export class CostMonitor {
  private static instance: CostMonitor;
  private limits: CostLimits | null = null;
  private pricing: Map<string, ModelPricing> = new Map();
  private lastConfigUpdate = 0;
  private readonly CONFIG_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): CostMonitor {
    if (!CostMonitor.instance) {
      CostMonitor.instance = new CostMonitor();
    }
    return CostMonitor.instance;
  }

  private async refreshConfig(): Promise<void> {
    const now = Date.now();
    if (now - this.lastConfigUpdate < this.CONFIG_CACHE_TTL && this.limits) {
      return;
    }

    try {
      // Fetch cost limits
      const { data: configData, error: configError } = await supabase
        .from('cost_monitoring_config')
        .select('*')
        .eq('is_active', true)
        .single();

      if (configError) {
        console.error('Failed to fetch cost config:', configError);
        // Use fallback limits
        this.limits = {
          daily_limit: 50.0,
          monthly_limit: 1000.0,
          per_user_daily_limit: 5.0,
          circuit_breaker_threshold: 10.0,
          is_active: true
        };
      } else {
        this.limits = {
          daily_limit: parseFloat(configData.daily_limit),
          monthly_limit: parseFloat(configData.monthly_limit),
          per_user_daily_limit: parseFloat(configData.per_user_daily_limit),
          circuit_breaker_threshold: parseFloat(configData.circuit_breaker_threshold),
          is_active: configData.is_active
        };
      }

      // Fetch pricing data
      const { data: pricingData, error: pricingError } = await supabase
        .from('ai_model_pricing')
        .select('*')
        .eq('is_active', true);

      if (!pricingError && pricingData) {
        this.pricing.clear();
        pricingData.forEach((price: any) => {
          this.pricing.set(price.model_name, {
            model_name: price.model_name,
            input_cost_per_token: parseFloat(price.input_cost_per_token),
            output_cost_per_token: parseFloat(price.output_cost_per_token)
          });
        });
      }

      this.lastConfigUpdate = now;
      console.log('Cost monitor config refreshed:', { limits: this.limits, pricingModels: this.pricing.size });
    } catch (error) {
      console.error('Error refreshing cost config:', error);
    }
  }

  async calculateCost(modelName: string, inputTokens: number, outputTokens: number): Promise<number> {
    await this.refreshConfig();
    
    const pricing = this.pricing.get(modelName);
    if (!pricing) {
      console.warn(`No pricing found for model: ${modelName}`);
      return 0;
    }

    const cost = (inputTokens * pricing.input_cost_per_token) + (outputTokens * pricing.output_cost_per_token);
    return Math.round(cost * 1000000) / 1000000; // Round to 6 decimal places
  }

  async checkCostLimits(userId: string, estimatedCost: number): Promise<{ allowed: boolean; reason?: string }> {
    await this.refreshConfig();

    if (!this.limits?.is_active) {
      return { allowed: true };
    }

    try {
      // Check circuit breaker threshold
      if (estimatedCost > this.limits.circuit_breaker_threshold) {
        console.warn(`Request exceeds circuit breaker threshold: $${estimatedCost} > $${this.limits.circuit_breaker_threshold}`);
        return { 
          allowed: false, 
          reason: `Request cost ($${estimatedCost.toFixed(4)}) exceeds maximum allowed ($${this.limits.circuit_breaker_threshold})` 
        };
      }

      // Check user daily limit
      const { data: userDailyCost } = await supabase
        .rpc('get_user_daily_cost', { user_uuid: userId });

      const userDailyTotal = parseFloat(userDailyCost || '0') + estimatedCost;
      if (userDailyTotal > this.limits.per_user_daily_limit) {
        return { 
          allowed: false, 
          reason: `Daily user limit exceeded: $${userDailyTotal.toFixed(4)} > $${this.limits.per_user_daily_limit}` 
        };
      }

      // Check total daily limit
      const { data: totalDailyCost } = await supabase
        .rpc('get_total_daily_cost');

      const totalDailyAmount = parseFloat(totalDailyCost || '0') + estimatedCost;
      if (totalDailyAmount > this.limits.daily_limit) {
        return { 
          allowed: false, 
          reason: `Daily system limit exceeded: $${totalDailyAmount.toFixed(4)} > $${this.limits.daily_limit}` 
        };
      }

      // Check monthly limit
      const { data: monthlyTotalCost } = await supabase
        .rpc('get_monthly_cost');

      const monthlyTotal = parseFloat(monthlyTotalCost || '0') + estimatedCost;
      if (monthlyTotal > this.limits.monthly_limit) {
        return { 
          allowed: false, 
          reason: `Monthly limit exceeded: $${monthlyTotal.toFixed(4)} > $${this.limits.monthly_limit}` 
        };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking cost limits:', error);
      // Fail safe - allow request but log error
      return { allowed: true };
    }
  }

  async logUsage(usage: UsageLog): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_usage_logs')
        .insert([usage]);

      if (error) {
        console.error('Failed to log usage:', error);
      } else {
        console.log('Usage logged:', {
          user: usage.user_id,
          function: usage.function_name,
          model: usage.model_name,
          cost: usage.total_cost,
          status: usage.status
        });
      }
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  }

  async estimateTokens(text: string): Promise<number> {
    // Simple token estimation: ~4 characters per token for English
    return Math.ceil(text.length / 4);
  }

  async withCostControl<T>(
    userId: string,
    modelName: string,
    functionName: string,
    inputText: string,
    operation: () => Promise<{ result: T; inputTokens: number; outputTokens: number }>
  ): Promise<T> {
    const startTime = Date.now();
    let usage: UsageLog | null = null;

    try {
      // Estimate input tokens for pre-check
      const estimatedInputTokens = await this.estimateTokens(inputText);
      const estimatedOutputTokens = Math.min(estimatedInputTokens * 2, 4096); // Conservative estimate
      const estimatedCost = await this.calculateCost(modelName, estimatedInputTokens, estimatedOutputTokens);

      // Pre-flight cost check
      const costCheck = await this.checkCostLimits(userId, estimatedCost);
      if (!costCheck.allowed) {
        usage = {
          user_id: userId,
          model_name: modelName,
          function_name: functionName,
          input_tokens: estimatedInputTokens,
          output_tokens: 0,
          total_cost: 0,
          request_duration: Date.now() - startTime,
          status: 'error',
          error_message: costCheck.reason
        };
        await this.logUsage(usage);
        throw new Error(`Cost limit exceeded: ${costCheck.reason}`);
      }

      // Execute the operation
      const { result, inputTokens, outputTokens } = await operation();
      const actualCost = await this.calculateCost(modelName, inputTokens, outputTokens);

      // Log successful usage
      usage = {
        user_id: userId,
        model_name: modelName,
        function_name: functionName,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        total_cost: actualCost,
        request_duration: Date.now() - startTime,
        status: 'success'
      };
      await this.logUsage(usage);

      return result;
    } catch (error) {
      // Log failed usage
      if (!usage) {
        const estimatedTokens = await this.estimateTokens(inputText);
        usage = {
          user_id: userId,
          model_name: modelName,
          function_name: functionName,
          input_tokens: estimatedTokens,
          output_tokens: 0,
          total_cost: 0,
          request_duration: Date.now() - startTime,
          status: 'error',
          error_message: error instanceof Error ? error.message : 'Unknown error'
        };
      } else {
        usage.status = 'error';
        usage.error_message = error instanceof Error ? error.message : 'Unknown error';
        usage.request_duration = Date.now() - startTime;
      }
      
      await this.logUsage(usage);
      throw error;
    }
  }

  async getCurrentUsage(userId: string): Promise<{
    dailyUsage: number;
    monthlyUsage: number;
    dailyLimit: number;
    monthlyLimit: number;
  }> {
    await this.refreshConfig();

    const [dailyResult, monthlyResult] = await Promise.all([
      supabase.rpc('get_user_daily_cost', { user_uuid: userId }),
      supabase.from('ai_usage_logs')
        .select('total_cost')
        .eq('user_id', userId)
        .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .eq('status', 'success')
    ]);

    const dailyUsage = parseFloat(dailyResult.data || '0');
    const monthlyUsage = monthlyResult.data?.reduce((sum, log) => sum + parseFloat(log.total_cost), 0) || 0;

    return {
      dailyUsage,
      monthlyUsage,
      dailyLimit: this.limits?.per_user_daily_limit || 5.0,
      monthlyLimit: this.limits?.monthly_limit || 1000.0
    };
  }
}

export const costMonitor = CostMonitor.getInstance();
