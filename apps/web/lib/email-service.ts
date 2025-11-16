/**
 * Email Service
 * Epic 7: Notifications & Alerts (Task 7.2)
 * 
 * Send emails via SMTP or email service
 */

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email
 * 
 * In production, integrate with:
 * - Resend (recommended)
 * - SendGrid
 * - AWS SES
 * - Nodemailer with SMTP
 * 
 * For now, we'll log emails and provide a stub
 */
export async function sendEmail({ to, subject, html }: EmailParams): Promise<void> {
  try {
    // Check if email service is configured
    if (process.env.EMAIL_SERVICE_ENABLED === 'true') {
      // TODO: Integrate with real email service
      // Example with Resend:
      /*
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'Contract IQ <notifications@contract-iq.org>',
        to,
        subject,
        html,
      });
      */
      
      console.log('📧 Email sent (production mode):', { to, subject });
    } else {
      // Development/stub mode - log email
      console.log('📧 Email (dev mode):', {
        to,
        subject,
        htmlLength: html.length,
        preview: html.substring(0, 200),
      });
    }
  } catch (error) {
    console.error('Send email error:', error);
    // Don't throw - email failures shouldn't break the app
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to Contract IQ</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to Contract IQ! 🎉</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Hi ${name},</p>
            <p style="font-size: 15px; color: #4b5563;">
              Thank you for joining Contract IQ! We're excited to help you manage your contracts with AI-powered insights.
            </p>
            <h3 style="color: #1f2937; margin-top: 30px;">Getting Started:</h3>
            <ul style="font-size: 15px; color: #4b5563;">
              <li>Upload your first contract (PDF, DOCX, DOC, or TXT)</li>
              <li>Get instant AI analysis of risks, costs, and key terms</li>
              <li>Chat with AI about your contracts</li>
              <li>Receive renewal reminders and risk alerts</li>
            </ul>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/contracts" 
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px;">
              Start Managing Contracts
            </a>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
              <p>Need help? Reply to this email or visit our support center.</p>
              <p>© ${new Date().getFullYear()} Contract IQ. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to Contract IQ - Let\'s Get Started!',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px;">Hi ${name},</p>
            <p style="font-size: 15px; color: #4b5563;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px;">
              Reset Password
            </a>
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
              <p>© ${new Date().getFullYear()} Contract IQ. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your Contract IQ Password',
    html,
  });
}
