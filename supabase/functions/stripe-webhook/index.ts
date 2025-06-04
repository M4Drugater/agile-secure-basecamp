
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

serve(async (req) => {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Webhook error', { status: 500 })
  }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const planId = session.metadata?.planId

  if (!userId || !planId) {
    console.error('Missing metadata in checkout session')
    return
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  
  // Upsert user subscription
  await supabase
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      subscription_plan_id: planId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })

  // Add credits for new subscription
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('credits_per_month')
    .eq('id', planId)
    .single()

  if (plan) {
    await supabase.rpc('add_credits', {
      user_uuid: userId,
      credits_to_add: plan.credits_per_month,
      description_text: 'Monthly subscription credits'
    })
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_subscription_id', subscription.id)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id, subscription_plan_id')
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (!userSub) return

  // Record payment
  await supabase
    .from('payment_history')
    .insert({
      user_id: userSub.user_id,
      stripe_invoice_id: invoice.id,
      amount: (invoice.amount_paid / 100).toString(),
      currency: invoice.currency,
      status: 'succeeded',
      description: 'Subscription payment',
    })

  // Add monthly credits
  const { data: plan } = await supabase
    .from('subscription_plans')
    .select('credits_per_month')
    .eq('id', userSub.subscription_plan_id)
    .single()

  if (plan) {
    await supabase.rpc('add_credits', {
      user_uuid: userSub.user_id,
      credits_to_add: plan.credits_per_month,
      description_text: 'Monthly subscription credits'
    })
  }
}
