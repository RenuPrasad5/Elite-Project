// Force rebuild
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import Stripe from 'stripe';
import { sendPlatformEmail } from '@/lib/email';
import { PurchaseConfirmationEmail } from '@/emails/PurchaseConfirmation';
import { SubscriptionRenewalEmail } from '@/emails/SubscriptionRenewal';
import { LOCAL_PRODUCTS } from '@/lib/products';
import * as React from 'react';


export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is missing. Cannot verify webhook signature.');
    return NextResponse.json({ error: 'Webhook engine not configured.' }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Signature verification failed: ${err.message}` }, { status: 400 });
  }

  console.log(`Successfully verified Stripe Webhook event: ${event.type}`);

  try {
    switch (event.type) {
      // 1. Handle Successful Checkout (Both subscriptions and product purchases)
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const { userId, planId, productId, type } = metadata;

        if (!userId) {
          console.warn('Webhook session completed event missing userId inside metadata.');
          break;
        }

        // Handle Subscription Syncing
        if (type === 'subscription' && planId) {
          const stripeSubId = session.subscription as string;
          const stripeCustomerId = session.customer as string;

          // Retrieve active period details from Stripe subscription
          const stripeSubscription = (await stripe.subscriptions.retrieve(stripeSubId)) as any;
          const currentPeriodEnd = new Date(stripeSubscription.current_period_end * 1000).toISOString();

          console.log(`Registering active subscription for user ${userId} under tier ${planId}`);
          
          const { error } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
              user_id: userId,
              tier: planId,
              status: 'active',
              stripe_subscription_id: stripeSubId,
              stripe_customer_id: stripeCustomerId,
              current_period_end: currentPeriodEnd,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

          if (error) {
            console.error('Failed to update subscription in database:', error.message);
            return NextResponse.json({ error: `DB Write Error: ${error.message}` }, { status: 500 });
          }

          // Trigger Welcome/Renewal Email
          const customerEmail = session.customer_details?.email;
          if (customerEmail) {
            sendPlatformEmail({
              to: customerEmail,
              subject: `Clearance Maintained: ${planId} Tier`,
              template: React.createElement(SubscriptionRenewalEmail, { tierName: planId, nextBillingDate: new Date(currentPeriodEnd).toLocaleDateString() }),
            });
          }
        }

        // Handle One-Time Digital Marketplace purchases
        if (type === 'product' && productId) {
          console.log(`Registering completed digital asset purchase for user ${userId} and product ID ${productId}`);
          
          const { error } = await supabaseAdmin
            .from('purchases')
            .insert({
              user_id: userId,
              product_id: Number(productId),
            });

          if (error && !error.message.includes('duplicate key')) {
            console.error('Failed to register product purchase in database:', error.message);
            return NextResponse.json({ error: `DB Write Error: ${error.message}` }, { status: 500 });
          }

          // Trigger Purchase Confirmation Email
          const customerEmail = session.customer_details?.email;
          const product = LOCAL_PRODUCTS.find(p => p.id === Number(productId));
          if (customerEmail && product) {
            sendPlatformEmail({
              to: customerEmail,
              subject: `Asset Unlocked: ${product.title}`,
              template: React.createElement(PurchaseConfirmationEmail, { productName: product.title, amount: session.amount_total ? (session.amount_total / 100).toFixed(2) : product.price.toFixed(2) }),
            });
          }
        }
        break;
      }

      // 2. Handle Subscription Updates (Renewals, upgrades/downgrades)
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const stripeSubId = subscription.id;
        const status = subscription.status; // active, past_due, unpaid, trialing
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        console.log(`Syncing subscription update for ${stripeSubId} (status: ${status})`);

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status,
            current_period_end: currentPeriodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', stripeSubId);

        if (error) {
          console.error('Failed to sync subscription updates in database:', error.message);
        }
        break;
      }

      // 3. Handle Subscription Deletion / Cancellations
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const stripeSubId = subscription.id;

        console.log(`Syncing deleted/canceled subscription status for ${stripeSubId}`);

        const { error } = await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', stripeSubId);

        if (error) {
          console.error('Failed to sync subscription cancellation in database:', error.message);
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe Webhook event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Error handling webhook transaction:', err);
    return NextResponse.json({ error: 'Webhook processing crash.' }, { status: 500 });
  }
}
