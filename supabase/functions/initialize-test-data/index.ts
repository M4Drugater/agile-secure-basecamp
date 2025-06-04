
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-SYNC] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep('=== STARTING STRIPE SYNCHRONIZATION ===');
    
    // Step 1: Validate environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set. Please configure it in Supabase Edge Functions secrets.');
    }
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is not set.');
    }
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is not set.');
    }
    
    logStep('Environment validation passed', {
      hasStripeKey: !!stripeKey,
      stripeKeyPrefix: stripeKey.substring(0, 7),
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!serviceRoleKey
    });

    // Step 2: Test Stripe connection
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    try {
      const account = await stripe.accounts.retrieve();
      logStep('Stripe connection successful', { 
        accountId: account.id,
        country: account.country,
        currency: account.default_currency
      });
    } catch (stripeError) {
      logStep('Stripe connection failed', { error: stripeError.message });
      throw new Error(`Stripe API error: ${stripeError.message}. Please verify your STRIPE_SECRET_KEY.`);
    }

    // Step 3: Verify existing subscription plans
    logStep('Checking existing subscription plans...');
    const { data: existingPlans, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price_monthly', { ascending: true });

    if (plansError) {
      logStep('Error fetching subscription plans', { error: plansError.message });
      throw new Error(`Failed to fetch subscription plans: ${plansError.message}`);
    }

    logStep('Found existing subscription plans', { 
      count: existingPlans?.length || 0,
      plans: existingPlans?.map(p => ({ name: p.name, price: p.price_monthly }))
    });

    // Step 4: Verify Stripe products and prices exist
    let syncStatus = {
      stripe_products_verified: false,
      database_plans_configured: existingPlans?.length > 0,
      credits_system_active: false,
      ai_pricing_configured: false
    };

    // Check if Pro and Enterprise plans have valid Stripe price IDs
    const proPlan = existingPlans?.find(p => p.name === 'Pro');
    const enterprisePlan = existingPlans?.find(p => p.name === 'Enterprise');

    if (proPlan?.stripe_price_id_monthly && enterprisePlan?.stripe_price_id_monthly) {
      try {
        // Verify Stripe prices exist
        const proPrice = await stripe.prices.retrieve(proPlan.stripe_price_id_monthly);
        const enterprisePrice = await stripe.prices.retrieve(enterprisePlan.stripe_price_id_monthly);
        
        logStep('Stripe prices verified', {
          proPrice: { id: proPrice.id, amount: proPrice.unit_amount },
          enterprisePrice: { id: enterprisePrice.id, amount: enterprisePrice.unit_amount }
        });
        
        syncStatus.stripe_products_verified = true;
      } catch (stripeError) {
        logStep('Stripe price verification failed', { error: stripeError.message });
        throw new Error(`Stripe prices not found: ${stripeError.message}. Please ensure Stripe products are properly configured.`);
      }
    } else {
      throw new Error('Pro and Enterprise plans are missing Stripe price IDs. Please configure them in your Stripe dashboard.');
    }

    // Step 5: Check credit system
    logStep('Verifying credit system...');
    const { data: creditStats } = await supabase
      .from('user_credits')
      .select('user_id')
      .limit(1);

    if (creditStats && creditStats.length > 0) {
      syncStatus.credits_system_active = true;
      logStep('Credit system is active');
    }

    // Step 6: Check AI pricing configuration
    const { data: aiPricing } = await supabase
      .from('ai_model_pricing')
      .select('model_name')
      .eq('is_active', true);

    if (aiPricing && aiPricing.length > 0) {
      syncStatus.ai_pricing_configured = true;
      logStep('AI pricing is configured', { models: aiPricing.map(p => p.model_name) });
    }

    // Step 7: Initialize any missing user credits
    const { data: usersWithoutCredits } = await supabase
      .from('profiles')
      .select('id')
      .not('id', 'in', `(SELECT user_id FROM user_credits WHERE user_id IS NOT NULL)`);

    let initializedUsers = 0;
    if (usersWithoutCredits && usersWithoutCredits.length > 0) {
      const creditRecords = usersWithoutCredits.map(user => ({
        user_id: user.id,
        total_credits: 100,
        used_credits_today: 0,
        last_reset_date: new Date().toISOString().split('T')[0]
      }));

      const { error: creditError } = await supabase
        .from('user_credits')
        .insert(creditRecords);

      if (creditError) {
        logStep('Credit initialization warning', { error: creditError.message });
      } else {
        initializedUsers = usersWithoutCredits.length;
        logStep('Initialized credits for users', { count: initializedUsers });
        syncStatus.credits_system_active = true;
      }
    }

    logStep('=== SYNCHRONIZATION COMPLETED SUCCESSFULLY ===');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Stripe synchronization verification completed successfully',
      details: {
        plans_created: existingPlans?.length || 0,
        users_initialized: initializedUsers,
        stripe_products: {
          pro: { 
            price_id: proPlan?.stripe_price_id_monthly, 
            amount_eur: proPlan?.price_monthly
          },
          enterprise: { 
            price_id: enterprisePlan?.stripe_price_id_monthly, 
            amount_eur: enterprisePlan?.price_monthly
          }
        },
        configuration: syncStatus
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    logStep('=== SYNCHRONIZATION FAILED ===', { message: error.message });
    console.error('Full error details:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      troubleshooting: {
        stripe_key_configured: !!Deno.env.get('STRIPE_SECRET_KEY'),
        supabase_configured: !!Deno.env.get('SUPABASE_URL') && !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
        common_solutions: [
          'Verify STRIPE_SECRET_KEY is set in Supabase Edge Functions secrets',
          'Ensure Stripe account is activated and has valid payment methods',
          'Check that Stripe API key has the required permissions',
          'Verify subscription plans are properly configured in database',
          'Ensure Stripe products and prices exist and match the database configuration'
        ]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
