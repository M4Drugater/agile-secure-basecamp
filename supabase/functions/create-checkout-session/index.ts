
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECKOUT-SESSION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    logStep('Starting checkout session creation');
    
    // Verify Stripe key
    if (!Deno.env.get('STRIPE_SECRET_KEY')) {
      throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY in edge function secrets.');
    }

    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      logStep('No authorization header provided');
      return new Response(JSON.stringify({ 
        error: 'Authentication required',
        details: 'Please log in to create a checkout session'
      }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      logStep('Authentication error', { error: authError });
      return new Response(JSON.stringify({ 
        error: 'Authentication failed',
        details: 'Invalid or expired session. Please log in again.'
      }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    logStep('User authenticated', { email: user.email });

    const { priceId, planId } = await req.json()
    logStep('Request data', { priceId, planId });

    if (!priceId || !planId) {
      return new Response(JSON.stringify({ 
        error: 'Missing required data',
        details: 'Both priceId and planId are required'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify the plan exists and is active
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .eq('is_active', true)
      .single();

    if (planError || !plan) {
      logStep('Plan not found in database', { planId, error: planError });
      return new Response(JSON.stringify({ 
        error: 'Invalid subscription plan',
        details: 'The selected plan is not available or has been discontinued'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify the price exists in Stripe
    let priceDetails;
    try {
      priceDetails = await stripe.prices.retrieve(priceId);
      logStep('Price details retrieved', { 
        id: priceDetails.id, 
        currency: priceDetails.currency, 
        amount: priceDetails.unit_amount,
        active: priceDetails.active
      });

      if (!priceDetails.active) {
        throw new Error('Price is not active in Stripe');
      }
    } catch (error) {
      logStep('Price verification failed', { priceId, error: error.message });
      return new Response(JSON.stringify({ 
        error: 'Invalid price configuration',
        details: `The price ${priceId} is not available. Please try again or contact support.`,
        troubleshooting: 'Run the Stripe sync to ensure all products and prices are properly configured.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Ensure the price is in EUR
    if (priceDetails.currency !== 'eur') {
      logStep('Price not in EUR currency', { currency: priceDetails.currency });
      return new Response(JSON.stringify({ 
        error: 'Currency mismatch',
        details: `Price is in ${priceDetails.currency.toUpperCase()}, but EUR is required`
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify price matches plan (with some tolerance for rounding)
    const expectedAmount = Math.round(plan.price_monthly * 100);
    if (Math.abs(priceDetails.unit_amount - expectedAmount) > 1) {
      logStep('Price amount mismatch', { 
        stripe: priceDetails.unit_amount, 
        expected: expectedAmount 
      });
      return new Response(JSON.stringify({ 
        error: 'Price mismatch',
        details: 'The Stripe price does not match the plan price. Please run the Stripe sync.',
        troubleshooting: 'Use the admin panel to sync Stripe products and prices.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check for existing active subscription
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('*, subscription_plan:subscription_plans(*)')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();

    if (existingSubscription) {
      logStep('User already has active subscription', { 
        currentPlan: existingSubscription.subscription_plan?.name 
      });
      return new Response(JSON.stringify({ 
        error: 'Active subscription exists',
        details: `You already have an active ${existingSubscription.subscription_plan?.name} subscription`,
        action: 'manage_existing'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get or create Stripe customer
    let customerId: string;
    const { data: userSubscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (userSubscription?.stripe_customer_id) {
      // Verify customer exists in Stripe
      try {
        await stripe.customers.retrieve(userSubscription.stripe_customer_id);
        customerId = userSubscription.stripe_customer_id;
        logStep('Using existing customer', { customerId });
      } catch (error) {
        logStep('Customer not found in Stripe, creating new one', { oldCustomerId: userSubscription.stripe_customer_id });
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: user.id },
        });
        customerId = customer.id;
      }
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      logStep('Created new customer', { customerId });
    }

    // Initialize user credits if they don't exist
    const { data: existingCredits } = await supabase
      .from('user_credits')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existingCredits) {
      const { error: creditError } = await supabase
        .from('user_credits')
        .insert({
          user_id: user.id,
          total_credits: 100,
          used_credits_today: 0,
          last_reset_date: new Date().toISOString().split('T')[0]
        });

      if (creditError) {
        logStep('Error initializing user credits', { error: creditError });
      } else {
        logStep('Initialized user credits');
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
      metadata: {
        userId: user.id,
        planId: planId,
        planName: plan.name,
        creditsPerMonth: plan.credits_per_month.toString(),
      },
      locale: 'en',
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto'
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planId: planId,
          planName: plan.name,
        }
      }
    });

    logStep('Checkout session created successfully', { 
      sessionId: session.id, 
      currency: priceDetails.currency,
      amount: priceDetails.unit_amount,
      planName: plan.name
    });

    return new Response(JSON.stringify({ 
      url: session.url,
      sessionId: session.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    logStep('ERROR creating checkout session', { message: error.message });
    console.error('Full error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Checkout session creation failed',
      details: error.message,
      troubleshooting: 'Please check your Stripe configuration and try again. If the problem persists, contact support.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
