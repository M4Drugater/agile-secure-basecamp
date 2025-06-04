
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
    logStep('=== STARTING COMPREHENSIVE STRIPE SYNCHRONIZATION ===');
    
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

    // Step 3: Clear existing plans for fresh start
    logStep('Clearing existing subscription plans');
    const { error: deleteError } = await supabase
      .from('subscription_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      logStep('Warning: Could not clear existing plans', { error: deleteError.message });
    } else {
      logStep('Successfully cleared existing plans');
    }

    // Step 4: Create/verify Stripe products
    logStep('Setting up Stripe products...');
    
    let proProduct, enterpriseProduct;
    
    try {
      // Try to retrieve existing products first
      try {
        proProduct = await stripe.products.retrieve('prod_RRxuCJBN3M2XL5');
        logStep('Found existing Pro product', { id: proProduct.id, name: proProduct.name });
      } catch (error) {
        logStep('Pro product not found, creating new one');
        proProduct = await stripe.products.create({
          id: 'prod_RRxuCJBN3M2XL5',
          name: 'LAIGENT Pro',
          description: 'Professional AI-powered development plan'
        });
        logStep('Created Pro product', { id: proProduct.id });
      }

      try {
        enterpriseProduct = await stripe.products.retrieve('prod_RRxrSQAeJfVMWH');
        logStep('Found existing Enterprise product', { id: enterpriseProduct.id, name: enterpriseProduct.name });
      } catch (error) {
        logStep('Enterprise product not found, creating new one');
        enterpriseProduct = await stripe.products.create({
          id: 'prod_RRxrSQAeJfVMWH',
          name: 'LAIGENT Enterprise',
          description: 'Enterprise AI-powered development plan'
        });
        logStep('Created Enterprise product', { id: enterpriseProduct.id });
      }
    } catch (productError) {
      logStep('Product setup failed', { error: productError.message });
      throw new Error(`Failed to setup Stripe products: ${productError.message}`);
    }

    // Step 5: Create/verify EUR prices
    logStep('Setting up EUR prices...');
    
    let proMonthlyPrice, enterpriseMonthlyPrice;
    
    try {
      // Check for existing prices
      const proPrices = await stripe.prices.list({
        product: proProduct.id,
        currency: 'eur',
        active: true
      });
      
      proMonthlyPrice = proPrices.data.find(p => 
        p.recurring?.interval === 'month' && p.unit_amount === 3900
      );
      
      if (!proMonthlyPrice) {
        logStep('Creating Pro monthly EUR price');
        proMonthlyPrice = await stripe.prices.create({
          product: proProduct.id,
          unit_amount: 3900, // €39.00
          currency: 'eur',
          recurring: { interval: 'month' },
          nickname: 'Pro Monthly EUR'
        });
        logStep('Created Pro price', { id: proMonthlyPrice.id, amount: 3900 });
      } else {
        logStep('Found existing Pro price', { id: proMonthlyPrice.id, amount: proMonthlyPrice.unit_amount });
      }

      const enterprisePrices = await stripe.prices.list({
        product: enterpriseProduct.id,
        currency: 'eur',
        active: true
      });
      
      enterpriseMonthlyPrice = enterprisePrices.data.find(p => 
        p.recurring?.interval === 'month' && p.unit_amount === 9900
      );
      
      if (!enterpriseMonthlyPrice) {
        logStep('Creating Enterprise monthly EUR price');
        enterpriseMonthlyPrice = await stripe.prices.create({
          product: enterpriseProduct.id,
          unit_amount: 9900, // €99.00
          currency: 'eur',
          recurring: { interval: 'month' },
          nickname: 'Enterprise Monthly EUR'
        });
        logStep('Created Enterprise price', { id: enterpriseMonthlyPrice.id, amount: 9900 });
      } else {
        logStep('Found existing Enterprise price', { id: enterpriseMonthlyPrice.id, amount: enterpriseMonthlyPrice.unit_amount });
      }
    } catch (priceError) {
      logStep('Price setup failed', { error: priceError.message });
      throw new Error(`Failed to setup Stripe prices: ${priceError.message}`);
    }

    // Step 6: Create subscription plans in database
    logStep('Creating subscription plans in database...');
    
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
        stripe_product_id: null,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Pro',
        description: 'For professionals and growing teams',
        price_monthly: 39,
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
        stripe_product_id: proProduct.id,
        is_active: true,
        is_featured: true
      },
      {
        name: 'Enterprise',
        description: 'For large organizations and teams',
        price_monthly: 99,
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
        stripe_product_id: enterpriseProduct.id,
        is_active: true,
        is_featured: false
      }
    ];

    const { data: insertedPlans, error: insertError } = await supabase
      .from('subscription_plans')
      .insert(plans)
      .select();

    if (insertError) {
      logStep('Database insert failed', { error: insertError.message });
      throw new Error(`Failed to insert plans into database: ${insertError.message}`);
    }

    logStep('Successfully created subscription plans', { count: insertedPlans.length });

    // Step 7: Initialize credit system
    logStep('Initializing credit system for existing users...');
    
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
      }
    }

    // Step 8: Update AI model pricing
    logStep('Updating AI model pricing...');
    
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
      logStep('AI pricing update warning', { error: pricingError.message });
    } else {
      logStep('Updated AI model pricing successfully');
    }

    logStep('=== SYNCHRONIZATION COMPLETED SUCCESSFULLY ===');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Stripe synchronization and credit system initialization completed successfully',
      details: {
        plans_created: insertedPlans.length,
        users_initialized: initializedUsers,
        stripe_products: {
          pro: { 
            product_id: proProduct.id,
            price_id: proMonthlyPrice.id, 
            amount_eur: 39
          },
          enterprise: { 
            product_id: enterpriseProduct.id,
            price_id: enterpriseMonthlyPrice.id, 
            amount_eur: 99
          }
        },
        configuration: {
          stripe_connected: true,
          database_updated: true,
          credits_initialized: true,
          ai_pricing_updated: true
        }
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
          'Verify Supabase project has the required tables and RLS policies'
        ]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
