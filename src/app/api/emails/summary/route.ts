import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Use the resend key if available, otherwise mock it for development
const resendKey = process.env.RESEND_API_KEY || 're_mock_key_only_for_dev';
const resend = new Resend(resendKey);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, stats } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Default mock stats if not provided
    const userStats = stats || {
      tradesLogged: 14,
      winRate: 68.5,
      pnl: 2450.50,
      streak: 5,
      level: 12
    };

    // Note: Since you're using a free Resend tier or unverified domain,
    // you can only send emails to the email address registered with your Resend account.
    // For testing, we hardcode the "to" email to the provided one, but in production
    // this would be the user's email.
    
    // Create the HTML template for the Elite Operator Weekly Summary
    const htmlTemplate = `
      <div style="font-family: 'Courier New', Courier, monospace; background-color: #050505; color: #f4f4f5; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #27272a;">
        
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d4af37; letter-spacing: 4px; margin-bottom: 5px; font-size: 24px;">EVIL ELITE</h1>
          <p style="color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Automated Operator Audit</p>
        </div>

        <div style="background-color: #0b0b0b; border: 1px solid #27272a; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #f4f4f5; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #27272a; padding-bottom: 10px; margin-top: 0;">Weekly Performance Matrix</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 12px;">Operator Rank:</td>
              <td style="padding: 8px 0; text-align: right; color: #d4af37; font-weight: bold; font-size: 12px;">Level ${userStats.level}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 12px;">Discipline Streak:</td>
              <td style="padding: 8px 0; text-align: right; color: #f97316; font-weight: bold; font-size: 12px;">${userStats.streak} Days</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 12px;">Trades Executed:</td>
              <td style="padding: 8px 0; text-align: right; color: #f4f4f5; font-weight: bold; font-size: 12px;">${userStats.tradesLogged}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 12px;">Win Rate Accuracy:</td>
              <td style="padding: 8px 0; text-align: right; color: #f4f4f5; font-weight: bold; font-size: 12px;">${userStats.winRate}%</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #a1a1aa; font-size: 12px; border-top: 1px dashed #27272a; padding-top: 15px; mt-2">Gross PnL Shift:</td>
              <td style="padding: 8px 0; text-align: right; color: ${userStats.pnl >= 0 ? '#34d399' : '#f43f5e'}; font-weight: bold; font-size: 14px; border-top: 1px dashed #27272a; padding-top: 15px; mt-2">${userStats.pnl >= 0 ? '+' : ''}$${userStats.pnl.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <p style="color: #a1a1aa; font-size: 12px; line-height: 1.6; text-align: justify; margin-bottom: 25px;">
          Emotion is the enemy of execution. Your weekly metrics indicate a steady adherence to the operational framework. Log back into your terminal node to maintain your discipline streak and advance your Operator Rank.
        </p>

        <a href="https://evilelite.club/login" style="display: block; width: 100%; text-align: center; background-color: #d4af37; color: #000000; text-decoration: none; padding: 12px 0; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px;">
          Initialize Dashboard Terminal
        </a>

        <p style="color: #52525b; font-size: 9px; text-align: center; margin-top: 30px; text-transform: uppercase;">
          Secure Node Access • EE Core Systems • Confidential Audit
        </p>
      </div>
    `;

    // Only attempt to send if it's a real key, otherwise mock success
    if (resendKey === 're_mock_key_only_for_dev') {
      console.log('Mocking Resend Gamification Summary Email for:', email);
      return NextResponse.json({ success: true, mocked: true });
    }

    const { data, error } = await resend.emails.send({
      from: 'EE OVERWATCH <onboarding@resend.dev>',
      to: email, // Resend free tier only allows sending to the registered email
      subject: 'SYS_AUDIT: Weekly Operator Performance Matrix',
      html: htmlTemplate
    });

    if (error) {
      console.error('Resend gamification email error:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
    
  } catch (err) {
    console.error('Failed to process gamification email request', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
