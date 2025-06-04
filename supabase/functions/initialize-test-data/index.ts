
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

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-SYNC] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep('Starting comprehensive Stripe synchronization with credit system initialization');
    
    // Step 1: Clear existing plans
    const { error: deleteError } = await supabase
      .from('subscription_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      logStep('Error clearing existing plans', { error: deleteError });
    } else {
      logStep('Cleared existing subscription plans');
    }

    // Step 2: Fetch your specific Stripe products using correct IDs
    logStep('Fetching Stripe products with correct IDs');
    
    const proProduct = await stripe.products.retrieve('prod_RRxuCJBN3M2XL5');
    const enterpriseProduct = await stripe.products.retrieve('prod_RRxrSQAeJfVMWH');
    
    logStep('Found Stripe products', { 
      pro: proProduct.name, 
      enterprise: enterpriseProduct.name 
    });

    // Step 3: Fetch EUR prices for each product
    const proPrices = await stripe.prices.list({
      product: proProduct.id,
      currency: 'eur',
      active: true
    });

    const enterprisePrices = await stripe.prices.list({
      product: enterpriseProduct.id,
      currency: 'eur',
      active: true
    });

    logStep('Fetched EUR prices', {
      proPrices: proPrices.data.length,
      enterprisePrices: enterprisePrices.data.length
    });

    // Find monthly prices
    const proMonthlyPrice = proPrices.data.find(p => p.recurring?.interval === 'month');
    const enterpriseMonthlyPrice = enterprisePrices.data.find(p => p.recurring?.interval === 'month');

    if (!proMonthlyPrice || !enterpriseMonthlyPrice) {
      throw new Error('Could not find monthly EUR prices for your products');
    }

    logStep('Found monthly EUR prices', {
      proPrice: `${proMonthlyPrice.unit_amount / 100} EUR (ID: ${proMonthlyPrice.id})`,
      enterprisePrice: `${enterpriseMonthlyPrice.unit_amount / 100} EUR (ID: ${enterpriseMonthlyPrice.id})`
    });

    // Step 4: Create subscription plans with correct data
    const plans = [
      {
        name: 'Free',
        description: 'Perfect for getting started with AI-powered professional development',
        price_monthly: 0,
        price_yearly: 0,
        credits_per_month: 100,
        max_daily_credits: 10,
        features: [
          'Basic AI Chat with CLIPOGINO',
          'Limited Content Generation',
          'Community Support',
          'Basic Learning Paths'
        ],
        stripe_price_id_monthly: null,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Pro',
        description: 'For professionals and growing teams',
        price_monthly: (proMonthlyPrice.unit_amount || 0) / 100,
        price_yearly: null,
        credits_per_month: 1000,
        max_daily_credits: 50,
        features: [
          'Unlimited AI Chat with CLIPOGINO',
          'Advanced Content Generation',
          'Full Analytics Dashboard',
          'Priority Support',
          'Knowledge Base Upload',
          'Custom Learning Paths'
        ],
        stripe_price_id_monthly: proMonthlyPrice.id,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: true
      },
      {
        name: 'Enterprise',
        description: 'For large organizations and teams',
        price_monthly: (enterpriseMonthlyPrice.unit_amount || 0) / 100,
        price_yearly: null,
        credits_per_month: 5000,
        max_daily_credits: 200,
        features: [
          'Everything in Pro',
          'Advanced AI Models',
          'Custom Integrations',
          'Dedicated Support Manager',
          'Advanced Analytics & Reporting',
          'Team Management & Admin Controls',
          'SSO & Enterprise Security',
          'Custom Branding'
        ],
        stripe_price_id_monthly: enterpriseMonthlyPrice.id,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: false
      }
    ];

    // Step 5: Insert plans into database
    const { data: insertedPlans, error: insertError } = await supabase
      .from('subscription_plans')
      .insert(plans)
      .select();

    if (insertError) {
      logStep('Error inserting plans', { error: insertError });
      throw insertError;
    }

    logStep('Successfully created subscription plans', { count: insertedPlans.length });

    // Step 6: Initialize credit system for all users
    logStep('Initializing credit system for all users');
    
    // Get all users who don't have credit records
    const { data: usersWithoutCredits } = await supabase
      .from('profiles')
      .select('id')
      .not('id', 'in', `(SELECT user_id FROM user_credits WHERE user_id IS NOT NULL)`);

    if (usersWithoutCredits && usersWithoutCredits.length > 0) {
      // Initialize credits for users without records
      const creditRecords = usersWithoutCredits.map(user => ({
        user_id: user.id,
        total_credits: 100, // Free tier starting credits
        used_credits_today: 0,
        last_reset_date: new Date().toISOString().split('T')[0]
      }));

      const { error: creditError } = await supabase
        .from('user_credits')
        .insert(creditRecords);

      if (creditError) {
        logStep('Error initializing user credits', { error: creditError });
      } else {
        logStep('Initialized credits for users', { count: usersWithoutCredits.length });
      }
    }

    // Step 7: Update AI model pricing for cost calculation
    const modelPricing = [
      {
        model_name: 'gpt-4o',
        input_cost_per_token: 0.0025 / 1000,
        output_cost_per_token: 0.01 / 1000,
        is_active: true
      },
      {
        model_name: 'gpt-4o-mini',
        input_cost_per_token: 0.00015 / 1000,
        output_cost_per_token: 0.0006 / 1000,
        is_active: true
      }
    ];

    const { error: pricingError } = await supabase
      .from('ai_model_pricing')
      .upsert(modelPricing, { onConflict: 'model_name' });

    if (pricingError) {
      logStep('Error updating model pricing', { error: pricingError });
    } else {
      logStep('Updated AI model pricing');
    }

    logStep('Synchronization completed successfully');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Stripe synchronization and credit system initialization completed successfully',
      plans: insertedPlans,
      currency: 'EUR',
      stripeProducts: {
        pro: { 
          productId: proProduct.id, 
          priceId: proMonthlyPrice.id, 
          amount: proMonthlyPrice.unit_amount,
          amountEur: (proMonthlyPrice.unit_amount || 0) / 100
        },
        enterprise: { 
          productId: enterpriseProduct.id, 
          priceId: enterpriseMonthlyPrice.id, 
          amount: enterpriseMonthlyPrice.unit_amount,
          amountEur: (enterpriseMonthlyPrice.unit_amount || 0) / 100
        }
      },
      creditSystemInitialized: true,
      usersInitialized: usersWithoutCredits?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    logStep('ERROR in comprehensive synchronization', { message: error.message });
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      details: 'Please check that your Stripe products exist and have EUR prices configured'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
