
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Initializing test subscription plans...')
    
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

    // Create basic subscription plans
    const plans = [
      {
        name: 'Free',
        description: 'Perfect for trying out the platform',
        price_monthly: 0,
        price_yearly: 0,
        credits_per_month: 100,
        max_daily_credits: 10,
        features: ['Basic AI chat', 'Limited content generation', 'Community support'],
        stripe_price_id_monthly: 'price_test_free',
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
        stripe_price_id_monthly: 'price_test_basic',
        stripe_price_id_yearly: 'price_test_basic_yearly',
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
        stripe_price_id_monthly: 'price_test_premium',
        stripe_price_id_yearly: 'price_test_premium_yearly',
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
        stripe_price_id_monthly: 'price_test_enterprise',
        stripe_price_id_yearly: 'price_test_enterprise_yearly',
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
      message: 'Test subscription plans created successfully',
      plans: data 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error initializing test data:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
