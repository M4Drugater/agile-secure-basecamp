
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.18.0'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBSCRIPTION-HANDLER] ${step}${detailsStr}`);
};

export async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
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

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
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
