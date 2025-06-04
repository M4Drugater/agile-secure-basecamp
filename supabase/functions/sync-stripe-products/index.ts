
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
    logStep('=== STARTING STRIPE REPAIR AND SYNC ===');
    
    // Validate environment variables
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured. Please add it to Edge Functions secrets.');
    }
    
    logStep('Initializing Stripe client');
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    
    // Test Stripe connection
    try {
      const account = await stripe.accounts.retrieve();
      logStep('Stripe connection successful', { 
        accountId: account.id,
        country: account.country 
      });
    } catch (error) {
      throw new Error(`Stripe connection failed: ${error.message}`);
    }

    // Step 1: Clean existing subscription plans with invalid price IDs
    logStep('Cleaning existing subscription plans');
    const { error: deleteError } = await supabase
      .from('subscription_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all existing plans

    if (deleteError) {
      logStep('Warning: Could not clean existing plans', { error: deleteError });
    } else {
      logStep('Successfully cleaned existing subscription plans');
    }

    // Step 2: Define our product structure with correct pricing
    const products = [
      {
        name: 'Free',
        description: 'Perfect for getting started with basic AI mentoring',
        price_monthly: 0,
        credits_per_month: 100,
        max_daily_credits: 10,
        features: [
          'Basic AI mentoring with CLIPOGINO',
          '100 AI credits per month',
          'Limited to 10 credits per day',
          'Access to basic content library',
          'Community support'
        ],
        is_featured: false,
        stripe_price_id_monthly: null // Free plan doesn't need Stripe
      },
      {
        name: 'Pro',
        description: 'Advanced AI mentoring for growing professionals',
        price_monthly: 39,
        credits_per_month: 1000,
        max_daily_credits: 50,
        features: [
          'Advanced AI mentoring with CLIPOGINO',
          '1,000 AI credits per month',
          'Up to 50 credits per day',
          'Full content library access',
          'Personalized learning paths',
          'Priority support',
          'Export capabilities'
        ],
        is_featured: true,
        stripe_price_id_monthly: null
      },
      {
        name: 'Enterprise',
        description: 'Complete solution for teams and organizations',
        price_monthly: 99,
        credits_per_month: 5000,
        max_daily_credits: 200,
        features: [
          'Unlimited AI mentoring with CLIPOGINO',
          '5,000 AI credits per month',
          'Up to 200 credits per day',
          'Complete platform access',
          'Custom learning paths',
          'Team management features',
          'Analytics and reporting',
          'Dedicated support',
          'Custom integrations'
        ],
        is_featured: false,
        stripe_price_id_monthly: null
      }
    ];

    const syncResults = {
      products_created: 0,
      prices_created: 0,
      database_updated: 0,
      users_credits_initialized: 0,
      errors: [],
      stripe_products: {} as any
    };

    // Step 3: Create or find Stripe products and prices
    for (const product of products) {
      if (product.price_monthly === 0) {
        logStep(`Skipping Stripe creation for free plan: ${product.name}`);
        continue;
      }

      try {
        logStep(`Processing product: ${product.name}`);
        
        // Search for existing product by name and metadata
        const existingProducts = await stripe.products.list({
          limit: 100,
        });
        
        let stripeProduct = existingProducts.data.find(p => 
          p.name === product.name && p.active
        );

        if (!stripeProduct) {
          // Create new product
          stripeProduct = await stripe.products.create({
            name: product.name,
            description: product.description,
            metadata: {
              laigent_plan: product.name.toLowerCase(),
              credits_per_month: product.credits_per_month.toString(),
              max_daily_credits: product.max_daily_credits.toString()
            },
          });
          logStep(`Created new Stripe product`, { 
            id: stripeProduct.id, 
            name: stripeProduct.name 
          });
          syncResults.products_created++;
        } else {
          logStep(`Found existing Stripe product`, { 
            id: stripeProduct.id, 
            name: stripeProduct.name 
          });
        }

        // Find or create price for this product
        const existingPrices = await stripe.prices.list({
          product: stripeProduct.id,
          currency: 'eur',
          active: true,
        });

        let stripePrice = existingPrices.data.find(p => 
          p.unit_amount === product.price_monthly * 100 &&
          p.recurring?.interval === 'month'
        );

        if (!stripePrice) {
          // Create new price
          stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: product.price_monthly * 100, // Convert to cents
            currency: 'eur',
            recurring: { interval: 'month' },
            metadata: {
              laigent_plan: product.name.toLowerCase(),
            },
          });
          logStep(`Created new Stripe price`, { 
            id: stripePrice.id, 
            amount: stripePrice.unit_amount 
          });
          syncResults.prices_created++;
        } else {
          logStep(`Found existing Stripe price`, { 
            id: stripePrice.id, 
            amount: stripePrice.unit_amount 
          });
        }

        // Update our product object with Stripe IDs
        product.stripe_price_id_monthly = stripePrice.id;
        syncResults.stripe_products[product.name.toLowerCase()] = {
          price_id: stripePrice.id,
          amount_eur: product.price_monthly
        };

      } catch (error) {
        logStep(`Error processing product ${product.name}`, { error: error.message });
        syncResults.errors.push(`${product.name}: ${error.message}`);
      }
    }

    // Step 4: Insert all products into database with correct price IDs
    logStep('Inserting products into database');
    
    for (const product of products) {
      try {
        const { error: insertError } = await supabase
          .from('subscription_plans')
          .insert({
            name: product.name,
            description: product.description,
            price_monthly: product.price_monthly,
            credits_per_month: product.credits_per_month,
            max_daily_credits: product.max_daily_credits,
            features: product.features,
            is_featured: product.is_featured,
            stripe_price_id_monthly: product.stripe_price_id_monthly,
            is_active: true
          });

        if (insertError) {
          logStep(`Error inserting ${product.name}`, { error: insertError });
          syncResults.errors.push(`Database insert for ${product.name}: ${insertError.message}`);
        } else {
          logStep(`Successfully inserted ${product.name} into database`);
          syncResults.database_updated++;
        }
      } catch (error) {
        logStep(`Database error for ${product.name}`, { error: error.message });
        syncResults.errors.push(`Database error for ${product.name}: ${error.message}`);
      }
    }

    // Step 5: Initialize AI model pricing if not exists
    logStep('Setting up AI model pricing');
    const { data: existingPricing } = await supabase
      .from('ai_model_pricing')
      .select('model_name')
      .eq('is_active', true);

    if (!existingPricing || existingPricing.length === 0) {
      const modelPricing = [
        {
          model_name: 'gpt-4o',
          input_cost_per_token: 0.0000025,
          output_cost_per_token: 0.00001,
          is_active: true
        },
        {
          model_name: 'gpt-4o-mini',
          input_cost_per_token: 0.00000015,
          output_cost_per_token: 0.0000006,
          is_active: true
        }
      ];

      const { error: pricingError } = await supabase
        .from('ai_model_pricing')
        .upsert(modelPricing);

      if (pricingError) {
        logStep('Error setting up AI pricing', { error: pricingError });
      } else {
        logStep('AI model pricing configured successfully');
      }
    }

    // Step 6: Initialize user credits for all users without credits
    logStep('Initializing user credits');
    const { data: usersWithoutCredits } = await supabase
      .from('profiles')
      .select('id')
      .not('id', 'in', `(SELECT user_id FROM user_credits WHERE user_id IS NOT NULL)`);

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

      if (!creditError) {
        syncResults.users_credits_initialized = usersWithoutCredits.length;
        logStep('User credits initialized', { count: syncResults.users_credits_initialized });
      }
    }

    logStep('=== STRIPE REPAIR COMPLETED SUCCESSFULLY ===');

    return new Response(JSON.stringify({
      success: true,
      message: 'Stripe system repaired and synchronized successfully',
      results: syncResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    logStep('=== STRIPE REPAIR FAILED ===', { error: error.message });
    console.error('Full error details:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      troubleshooting: {
        stripe_configured: !!Deno.env.get('STRIPE_SECRET_KEY'),
        supabase_configured: true,
        common_solutions: [
          'Ensure STRIPE_SECRET_KEY is configured in Supabase Edge Functions secrets',
          'Verify your Stripe account is activated',
          'Check that your Stripe API key has the required permissions',
          'Make sure you are using a live or test API key consistently'
        ]
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
})
