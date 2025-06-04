
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

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      logStep('Webhook signature verification failed', { error: err.message });
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    logStep('Processing webhook event', { type: event.type, id: event.id });

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
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    logStep('Webhook error', { message: error.message });
    console.error('Full webhook error:', error);
    return new Response('Webhook error', { status: 500 })
  }
})

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const planId = session.metadata?.planId

  if (!userId || !planId) {
    logStep('Missing metadata in checkout session', { 
      userId: !!userId, 
      planId: !!planId 
    });
    return
  }

  logStep('Processing checkout completion', { userId, planId });

  try {
    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
    
    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      logStep('Plan not found', { planId, error: planError });
      return
    }

    // Upsert user subscription
    const { error: subError } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        subscription_plan_id: planId,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      })

    if (subError) {
      logStep('Error upserting subscription', { error: subError });
      return
    }

    // Add initial credits for new subscription
    const { error: creditError } = await supabase.rpc('add_credits', {
      user_uuid: userId,
      credits_to_add: plan.credits_per_month,
      description_text: `Initial ${plan.name} subscription credits`
    })

    if (creditError) {
      logStep('Error adding initial credits', { error: creditError });
    } else {
      logStep('Added initial subscription credits', { 
        credits: plan.credits_per_month,
        planName: plan.name 
      });
    }

    // Record payment
    const { error: paymentError } = await supabase
      .from('payment_history')
      .insert({
        user_id: userId,
        stripe_invoice_id: session.invoice as string,
        amount: ((session.amount_total || 0) / 100).toString(),
        currency: session.currency || 'eur',
        status: 'succeeded',
        description: `${plan.name} subscription - Initial payment`,
        payment_method: 'card'
      })

    if (paymentError) {
      logStep('Error recording payment', { error: paymentError });
    }

    logStep('Checkout completion processed successfully');
  } catch (error) {
    logStep('Error in checkout completion', { message: error.message });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  logStep('Processing subscription update', { 
    id: subscription.id, 
    status: subscription.status 
  });

  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    logStep('Error updating subscription', { error });
  } else {
    logStep('Subscription updated successfully');
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  logStep('Processing subscription deletion', { id: subscription.id });

  const { error } = await supabase
    .from('user_subscriptions')
    .update({
      status: 'canceled',
    })
    .eq('stripe_subscription_id', subscription.id)

  if (error) {
    logStep('Error canceling subscription', { error });
  } else {
    logStep('Subscription canceled successfully');
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  logStep('Processing successful payment', { 
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription 
  });

  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id, subscription_plan_id, subscription_plan:subscription_plans(*)')
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (!userSub) {
    logStep('User subscription not found', { subscriptionId: invoice.subscription });
    return
  }

  // Record payment
  const { error: paymentError } = await supabase
    .from('payment_history')
    .insert({
      user_id: userSub.user_id,
      stripe_invoice_id: invoice.id,
      amount: (invoice.amount_paid / 100).toString(),
      currency: invoice.currency,
      status: 'succeeded',
      description: `${userSub.subscription_plan?.name} subscription renewal`,
      payment_method: 'card'
    })

  if (paymentError) {
    logStep('Error recording payment', { error: paymentError });
  }

  // Add monthly credits only for renewal payments (not initial)
  if (invoice.billing_reason === 'subscription_cycle') {
    const plan = userSub.subscription_plan
    if (plan) {
      const { error: creditError } = await supabase.rpc('add_credits', {
        user_uuid: userSub.user_id,
        credits_to_add: plan.credits_per_month,
        description_text: `Monthly ${plan.name} subscription credits`
      })

      if (creditError) {
        logStep('Error adding monthly credits', { error: creditError });
      } else {
        logStep('Added monthly subscription credits', { 
          credits: plan.credits_per_month,
          planName: plan.name 
        });
      }
    }
  }

  logStep('Payment processing completed successfully');
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  logStep('Processing failed payment', { 
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription 
  });

  const { data: userSub } = await supabase
    .from('user_subscriptions')
    .select('user_id, subscription_plan:subscription_plans(*)')
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (!userSub) {
    logStep('User subscription not found for failed payment');
    return
  }

  // Record failed payment
  const { error: paymentError } = await supabase
    .from('payment_history')
    .insert({
      user_id: userSub.user_id,
      stripe_invoice_id: invoice.id,
      amount: (invoice.amount_due / 100).toString(),
      currency: invoice.currency,
      status: 'failed',
      description: `${userSub.subscription_plan?.name} subscription payment failed`,
      payment_method: 'card'
    })

  if (paymentError) {
    logStep('Error recording failed payment', { error: paymentError });
  } else {
    logStep('Failed payment recorded successfully');
  }
}
