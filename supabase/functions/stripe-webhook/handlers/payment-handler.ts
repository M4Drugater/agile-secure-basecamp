
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PAYMENT-HANDLER] ${step}${detailsStr}`);
};

export async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
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

export async function handlePaymentFailed(invoice: Stripe.Invoice) {
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
