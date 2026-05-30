// Force rebuild
import { NextResponse } from 'next/server';
import { sendPlatformEmail } from '@/lib/email';
import { AbandonedCheckoutEmail } from '@/emails/AbandonedCheckout';
import { UpsellCampaignEmail } from '@/emails/UpsellCampaign';
import * as React from 'react';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, type, data } = body;
    // data can include productName, checkoutUrl for abandoned checkout

    // In a real scenario, this endpoint should be protected by a server-to-server secret
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
        // Return 401 in production, but we will allow it to proceed in dev for testing
        if (process.env.NODE_ENV !== 'development') {
            return NextResponse.json({ error: 'Unauthorized marketing trigger' }, { status: 401 });
        }
    }

    if (!email || !type) {
      return NextResponse.json({ error: 'Email and type are required' }, { status: 400 });
    }

    let success = false;
    let errorMsg = null;

    if (type === 'abandoned_checkout') {
      const result = await sendPlatformEmail({
        to: email,
        subject: 'Action Required: Incomplete Authorization',
        template: React.createElement(AbandonedCheckoutEmail, { 
          productName: data?.productName, 
          checkoutUrl: data?.checkoutUrl || `${process.env.NEXT_PUBLIC_APP_URL}/cart` 
        })
      });
      success = result.success;
      errorMsg = result.error;
    } else if (type === 'upsell_campaign') {
      const result = await sendPlatformEmail({
        to: email,
        subject: 'Notice: Elite Clearance Authorized',
        template: React.createElement(UpsellCampaignEmail, {})
      });
      success = result.success;
      errorMsg = result.error;
    } else {
      return NextResponse.json({ error: 'Invalid campaign type' }, { status: 400 });
    }

    if (!success) {
      console.error('Marketing email failed:', errorMsg);
      return NextResponse.json({ error: 'Failed to dispatch marketing sequence' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Campaign ${type} dispatched to ${email}` });
  } catch (error) {
    console.error('Marketing API crash:', error);
    return NextResponse.json({ error: 'Internal system failure.' }, { status: 500 });
  }
}
