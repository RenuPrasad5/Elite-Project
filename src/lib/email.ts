import { Resend } from 'resend';
import * as React from 'react';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

interface SendPlatformEmailOptions {
  to: string;
  subject: string;
  template: React.ReactElement;
}

/**
 * Core utility for sending automated platform emails.
 * 
 * @param to - Recipient email address
 * @param subject - Email subject line
 * @param template - The React Email component to render
 */
export async function sendPlatformEmail({ to, subject, template }: SendPlatformEmailOptions) {
  try {
    // In development or if the API key is missing, log instead of failing completely.
    if (!process.env.RESEND_API_KEY) {
      console.warn(`[EMAIL MOCK] Would have sent "${subject}" to ${to}`);
      return { success: true, mocked: true };
    }

    const { data, error } = await resend.emails.send({
      from: 'Evil Elite Terminal <onboarding@resend.dev>', // Update to your verified domain (e.g., system@evilelite.club) in production
      to,
      subject,
      react: template,
    });

    if (error) {
      console.error('Resend API error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to dispatch platform email:', error);
    return { success: false, error };
  }
}
