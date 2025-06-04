
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
    logStep('Starting Stripe synchronization with EUR currency');
    
    // Clear existing plans first
    const { error: deleteError } = await supabase
      .from('subscription_plans')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      logStep('Error clearing existing plans', { error: deleteError });
    } else {
      logStep('Cleared existing subscription plans');
    }

    // Fetch your existing Stripe products
    logStep('Fetching existing Stripe products');
    const products = await stripe.products.list({ limit: 100 });
    
    // Find your specific products
    const proProduct = products.data.find(p => p.id === 'prod_RRxuCJBN3M2XL5');
    const leadershipProduct = products.data.find(p => p.id === 'prod_RRxrSQAeJfVMWH');
    
    if (!proProduct || !leadershipProduct) {
      throw new Error('Could not find your Stripe products. Please verify the product IDs.');
    }

    logStep('Found Stripe products', { 
      pro: proProduct.name, 
      leadership: leadershipProduct.name 
    });

    // Fetch prices for each product (EUR currency)
    const proPrices = await stripe.prices.list({
      product: proProduct.id,
      currency: 'eur',
      active: true
    });

    const leadershipPrices = await stripe.prices.list({
      product: leadershipProduct.id,
      currency: 'eur',
      active: true
    });

    logStep('Fetched prices', {
      proPrices: proPrices.data.length,
      leadershipPrices: leadershipPrices.data.length
    });

    // Find monthly prices
    const proMonthlyPrice = proPrices.data.find(p => p.recurring?.interval === 'month');
    const leadershipMonthlyPrice = leadershipPrices.data.find(p => p.recurring?.interval === 'month');

    if (!proMonthlyPrice || !leadershipMonthlyPrice) {
      throw new Error('Could not find monthly prices for your products in EUR');
    }

    logStep('Found monthly prices', {
      proPrice: proMonthlyPrice.unit_amount,
      leadershipPrice: leadershipMonthlyPrice.unit_amount
    });

    // Create subscription plans with your actual Stripe data
    const plans = [
      {
        name: 'Free',
        description: 'Perfect for trying out the platform',
        price_monthly: 0,
        price_yearly: 0,
        credits_per_month: 100,
        max_daily_credits: 10,
        features: ['Basic AI chat', 'Limited content generation', 'Community support'],
        stripe_price_id_monthly: null,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: false
      },
      {
        name: proProduct.name,
        description: proProduct.description || 'Professional plan for growing needs',
        price_monthly: (proMonthlyPrice.unit_amount || 0) / 100, // Convert from cents to euros
        price_yearly: null, // Will be updated when yearly price is found
        credits_per_month: 5000,
        max_daily_credits: 200,
        features: ['Advanced AI chat', 'Unlimited content generation', 'Priority support', 'Advanced analytics'],
        stripe_price_id_monthly: proMonthlyPrice.id,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: true
      },
      {
        name: leadershipProduct.name,
        description: leadershipProduct.description || 'Leadership development for executives',
        price_monthly: (leadershipMonthlyPrice.unit_amount || 0) / 100, // Convert from cents to euros
        price_yearly: null, // Will be updated when yearly price is found
        credits_per_month: 20000,
        max_daily_credits: 1000,
        features: ['Premium AI models', 'Custom leadership content', 'Dedicated support', 'Executive coaching', 'Team management tools'],
        stripe_price_id_monthly: leadershipMonthlyPrice.id,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: false
      }
    ];

    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(plans)
      .select()

    if (error) {
      logStep('Error inserting plans', { error });
      throw error;
    }

    logStep('Successfully created subscription plans', { count: data.length });

    return new Response(JSON.stringify({ 
      message: 'Stripe synchronization completed successfully',
      plans: data,
      currency: 'EUR',
      stripeProducts: {
        pro: { productId: proProduct.id, priceId: proMonthlyPrice.id, amount: proMonthlyPrice.unit_amount },
        leadership: { productId: leadershipProduct.id, priceId: leadershipMonthlyPrice.id, amount: leadershipMonthlyPrice.unit_amount }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    logStep('ERROR in Stripe synchronization', { message: error.message });
    console.error('Error details:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Please check that your Stripe products exist and have EUR prices configured'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
