// Force rebuild
import { NextResponse } from 'next/server';
import { sendPlatformEmail } from '@/lib/email';
import { WelcomeEmail } from '@/emails/WelcomeOnboarding';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import * as React from 'react';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Since this is a public-facing endpoint intended for post-signup, 
    // we should ideally verify the user actually just signed up.
    // For MVP, we trust the email passed or check against Supabase admin.
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    // Safety check to ensure we don't spam random emails
    const userExists = users?.some(u => u.email === email);
    if (!userExists && !error) {
       return NextResponse.json({ error: 'User not found in system' }, { status: 404 });
    }

    const { success, error: sendError } = await sendPlatformEmail({
      to: email,
      subject: 'Clearance Granted: Welcome to Evil Elite',
      template: React.createElement(WelcomeEmail, { userEmail: email })
    });

    if (!success) {
      console.error('Welcome email failed:', sendError);
      return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Welcome API crash:', error);
    return NextResponse.json({ error: 'Internal system failure.' }, { status: 500 });
  }
}
