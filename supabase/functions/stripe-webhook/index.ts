
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.18.0'
import { handleCheckoutCompleted } from './handlers/checkout-handler.ts'
import { handleSubscriptionUpdated, handleSubscriptionDeleted } from './handlers/subscription-handler.ts'
import { handlePaymentSucceeded, handlePaymentFailed } from './handlers/payment-handler.ts'
import { logStep } from './utils/webhook-utils.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

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
        await handleCheckoutCompleted(session, stripe)
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
