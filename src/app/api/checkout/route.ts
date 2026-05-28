import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getProducts } from '@/lib/products';

const PLAN_PRICES: Record<string, number> = {
  Starter: 29.00,
  Pro: 79.00,
  Elite: 199.00,
};

/**
 * Programmatically gets or creates a price ID on Stripe for recurring plans
 * to avoid manual product provisioning by the user.
 */
async function getOrCreatePriceForPlan(planId: string, priceAmount: number) {
  try {
    const products = await stripe.products.list({ limit: 10, active: true });
    let product = products.data.find((p) => p.name === `EVIL ELITE - ${planId}`);

    if (!product) {
      product = await stripe.products.create({
        name: `EVIL ELITE - ${planId}`,
        description: `Premium Clearance Level Access: ${planId} Tier Membership`,
      });
    }

    const prices = await stripe.prices.list({ product: product.id, limit: 10 });
    let price = prices.data.find(
      (p) => p.unit_amount === Math.round(priceAmount * 100) && p.recurring?.interval === 'month'
    );

    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: Math.round(priceAmount * 100),
        currency: 'usd',
        recurring: { interval: 'month' },
      });
    }

    return price.id;
  } catch (err) {
    console.error(`Error resolving price for ${planId}:`, err);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const { productId, planId, userId, email } = await req.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing operator credentials (userId or email).' }, { status: 400 });
    }

    // High-Availability Fallback Mode
    const stripeKeyExists = !!process.env.STRIPE_SECRET_KEY;
    if (!stripeKeyExists) {
      console.warn('STRIPE_SECRET_KEY is absent. Operating in sandbox fallback simulation mode.');
      return NextResponse.json({
        simulated: true,
        message: 'Successfully generated high-fidelity simulation checkout endpoint.',
      });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // 1. Handle Subscription Checkout Flow
    if (planId) {
      const priceAmount = PLAN_PRICES[planId];
      if (!priceAmount) {
        return NextResponse.json({ error: 'Invalid subscription tier requested.' }, { status: 400 });
      }

      console.log(`Generating Stripe checkout session for ${planId} subscription plan for ${email}`);
      const priceId = await getOrCreatePriceForPlan(planId, priceAmount);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: email,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=subscription&tier=${planId}`,
        cancel_url: `${appUrl}/checkout/cancel?type=subscription`,
        metadata: {
          userId,
          planId,
          type: 'subscription',
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // 2. Handle One-Time Digital Product Checkout Flow
    if (productId) {
      const allProducts = await getProducts();
      const product = allProducts.find((p) => p.id === Number(productId));

      if (!product) {
        return NextResponse.json({ error: 'Requested digital asset not found in database.' }, { status: 404 });
      }

      console.log(`Generating Stripe checkout session for product: ${product.title} for ${email}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: product.title,
                description: product.description,
              },
              unit_amount: Math.round(product.price * 100),
            },
            quantity: 1,
          },
        ],
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&type=product&productId=${productId}`,
        cancel_url: `${appUrl}/checkout/cancel?type=product`,
        metadata: {
          userId,
          productId: String(productId),
          type: 'product',
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Requested checkouts must specify a product ID or subscription tier.' }, { status: 400 });
  } catch (err: any) {
    console.error('Error generating Stripe Checkout session:', err);
    return NextResponse.json({ error: err.message || 'Payment engine encounter internal crash.' }, { status: 500 });
  }
}
