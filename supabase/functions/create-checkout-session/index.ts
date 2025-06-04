
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
    
    // Verify user is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      logStep('No authorization header provided');
      return new Response(JSON.stringify({ error: 'No authorization header provided' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      logStep('Authentication error', { error: authError });
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    logStep('User authenticated', { email: user.email });

    const { priceId, planId } = await req.json()
    logStep('Request data', { priceId, planId });

    if (!priceId || !planId) {
      return new Response(JSON.stringify({ error: 'Missing priceId or planId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify the price exists in Stripe and get its details
    let priceDetails;
    try {
      priceDetails = await stripe.prices.retrieve(priceId);
      logStep('Price details retrieved', { 
        id: priceDetails.id, 
        currency: priceDetails.currency, 
        amount: priceDetails.unit_amount 
      });
    } catch (error) {
      logStep('Price not found in Stripe', { priceId, error: error.message });
      return new Response(JSON.stringify({ 
        error: 'Invalid price ID',
        details: `Price ${priceId} not found in your Stripe account`
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

    // Get or create Stripe customer
    let customerId: string
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingSubscription?.stripe_customer_id) {
      customerId = existingSubscription.stripe_customer_id
      logStep('Using existing customer', { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id
      logStep('Created new customer', { customerId });
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
      },
      locale: 'es', // Spanish locale since you're implementing in Spanish
    })

    logStep('Checkout session created successfully', { 
      sessionId: session.id, 
      currency: priceDetails.currency,
      amount: priceDetails.unit_amount 
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    logStep('ERROR creating checkout session', { message: error.message });
    console.error('Full error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Please check your Stripe configuration and try again'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
