
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECKOUT-HANDLER] ${step}${detailsStr}`);
};

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe) {
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
