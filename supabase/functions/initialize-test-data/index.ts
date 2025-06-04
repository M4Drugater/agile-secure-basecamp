
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Initializing Stripe products and Supabase plans...')
    
    // Check if plans already exist
    const { data: existingPlans } = await supabase
      .from('subscription_plans')
      .select('id')
      .limit(1)

    if (existingPlans && existingPlans.length > 0) {
      return new Response(JSON.stringify({ message: 'Plans already exist' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create products and prices in Stripe first
    console.log('Creating Stripe products...')

    // Free plan (no Stripe product needed)
    const freeStripePrice = null

    // Basic plan
    const basicProduct = await stripe.products.create({
      name: 'LAIGENT Basic',
      description: 'Great for individual professionals'
    })
    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 900, // $9.00
      currency: 'usd',
      recurring: { interval: 'month' }
    })

    // Premium plan  
    const premiumProduct = await stripe.products.create({
      name: 'LAIGENT Premium',
      description: 'Perfect for growing teams'
    })
    const premiumPrice = await stripe.prices.create({
      product: premiumProduct.id,
      unit_amount: 2900, // $29.00
      currency: 'usd',
      recurring: { interval: 'month' }
    })

    // Enterprise plan
    const enterpriseProduct = await stripe.products.create({
      name: 'LAIGENT Enterprise',
      description: 'For large organizations'
    })
    const enterprisePrice = await stripe.prices.create({
      product: enterpriseProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
      recurring: { interval: 'month' }
    })

    console.log('Stripe products created successfully')

    // Create subscription plans in Supabase with real Stripe price IDs
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
        name: 'Basic',
        description: 'Great for individual professionals',
        price_monthly: 9,
        price_yearly: 90,
        credits_per_month: 1000,
        max_daily_credits: 50,
        features: ['Advanced AI chat', 'Content generation', 'Email support', 'Basic analytics'],
        stripe_price_id_monthly: basicPrice.id,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: false
      },
      {
        name: 'Premium',
        description: 'Perfect for growing teams',
        price_monthly: 29,
        price_yearly: 290,
        credits_per_month: 5000,
        max_daily_credits: 200,
        features: ['Premium AI models', 'Unlimited content generation', 'Priority support', 'Advanced analytics', 'Team collaboration'],
        stripe_price_id_monthly: premiumPrice.id,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: true
      },
      {
        name: 'Enterprise',
        description: 'For large organizations',
        price_monthly: 99,
        price_yearly: 990,
        credits_per_month: 20000,
        max_daily_credits: 1000,
        features: ['Custom AI models', 'Unlimited everything', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
        stripe_price_id_monthly: enterprisePrice.id,
        stripe_price_id_yearly: null,
        is_active: true,
        is_featured: false
      }
    ]

    const { data, error } = await supabase
      .from('subscription_plans')
      .insert(plans)
      .select()

    if (error) throw error

    console.log('Created subscription plans:', data)

    return new Response(JSON.stringify({ 
      message: 'Stripe products and subscription plans created successfully',
      plans: data,
      stripeProducts: {
        basic: { productId: basicProduct.id, priceId: basicPrice.id },
        premium: { productId: premiumProduct.id, priceId: premiumPrice.id },
        enterprise: { productId: enterpriseProduct.id, priceId: enterprisePrice.id }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error initializing data:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
