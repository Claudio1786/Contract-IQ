/**
 * Notification Service
 * Epic 7: Notifications & Alerts (Tasks 7.1, 7.2, 7.3)
 * 
 * Create and manage notifications
 */

import prisma from './prisma';
import { sendEmail } from './email-service';

export type NotificationType =
  | 'contract_uploaded'
  | 'analysis_complete'
  | 'renewal_reminder'
  | 'high_risk_alert'
  | 'compliance_alert'
  | 'system';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  contractId?: string;
  sendEmail?: boolean;
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  contractId,
  sendEmail: shouldSendEmail = false,
}: CreateNotificationParams) {
  try {
    // Create in-app notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        contractId: contractId || null,
        read: false,
      },
    });

    // Send email if requested
    if (shouldSendEmail) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      });

      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: title,
          html: getEmailTemplate(type, title, message, user.name || 'User'),
        });
      }
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
}

/**
 * Create notification for contract upload
 */
export async function notifyContractUploaded(
  userId: string,
  contractTitle: string,
  contractId: string
) {
  return createNotification({
    userId,
    type: 'contract_uploaded',
    title: 'Contract Uploaded Successfully',
    message: `Your contract "${contractTitle}" has been uploaded and is being processed.`,
    contractId,
    sendEmail: false, // Don't spam for uploads
  });
}

/**
 * Create notification for analysis completion
 */
export async function notifyAnalysisComplete(
  userId: string,
  contractTitle: string,
  contractId: string,
  riskLevel: string
) {
  const message =
    riskLevel === 'HIGH'
      ? `Analysis complete for "${contractTitle}". ⚠️ HIGH RISK detected - review recommended.`
      : `Analysis complete for "${contractTitle}". Risk level: ${riskLevel}`;

  return createNotification({
    userId,
    type: 'analysis_complete',
    title: 'Contract Analysis Complete',
    message,
    contractId,
    sendEmail: true, // Send email for analysis completion
  });
}

/**
 * Create notification for renewal reminder
 */
export async function notifyRenewalReminder(
  userId: string,
  contractTitle: string,
  contractId: string,
  daysUntilRenewal: number
) {
  return createNotification({
    userId,
    type: 'renewal_reminder',
    title: 'Contract Renewal Reminder',
    message: `Contract "${contractTitle}" expires in ${daysUntilRenewal} days. Consider reviewing renewal terms.`,
    contractId,
    sendEmail: true, // Important - send email
  });
}

/**
 * Create notification for high risk alert
 */
export async function notifyHighRiskAlert(
  userId: string,
  contractTitle: string,
  contractId: string,
  riskDetails: string
) {
  return createNotification({
    userId,
    type: 'high_risk_alert',
    title: '⚠️ High Risk Contract Alert',
    message: `Contract "${contractTitle}" has been flagged as high risk. ${riskDetails}`,
    contractId,
    sendEmail: true, // Critical - send email
  });
}

/**
 * Create notification for compliance alert
 */
export async function notifyComplianceAlert(
  userId: string,
  contractTitle: string,
  contractId: string,
  complianceIssue: string
) {
  return createNotification({
    userId,
    type: 'compliance_alert',
    title: 'Compliance Alert',
    message: `Contract "${contractTitle}" has compliance issues: ${complianceIssue}`,
    contractId,
    sendEmail: true, // Important - send email
  });
}

/**
 * Check for renewal reminders and create notifications
 * Should be run daily via cron job
 */
export async function checkRenewalReminders() {
  try {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDays = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    // Find contracts expiring in 30, 60, or 90 days
    const expiringContracts = await prisma.contract.findMany({
      where: {
        endDate: {
          gte: now,
          lte: ninetyDays,
        },
        status: 'ANALYZED',
      },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    for (const contract of expiringContracts) {
      if (!contract.endDate) continue;

      const daysUntil = Math.ceil(
        (contract.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Only notify at specific intervals (90, 60, 30 days)
      if (
        daysUntil === 90 ||
        daysUntil === 60 ||
        daysUntil === 30 ||
        daysUntil === 7
      ) {
        // Check if we already notified for this interval
        const existingNotification = await prisma.notification.findFirst({
          where: {
            userId: contract.userId,
            type: 'renewal_reminder',
            contractId: contract.id,
            createdAt: {
              gte: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        });

        if (!existingNotification) {
          await notifyRenewalReminder(
            contract.userId,
            contract.title,
            contract.id,
            daysUntil
          );
        }
      }
    }

    console.log(`✅ Checked ${expiringContracts.length} contracts for renewal reminders`);
  } catch (error) {
    console.error('Check renewal reminders error:', error);
    throw error;
  }
}

/**
 * Get email template for notification
 */
function getEmailTemplate(
  type: NotificationType,
  title: string,
  message: string,
  userName: string
): string {
  const baseStyles = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #333;
  `;

  const containerStyles = `
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 20px;
  `;

  const headerStyles = `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 30px;
    border-radius: 12px 12px 0 0;
  `;

  const contentStyles = `
    background: #f9fafb;
    padding: 30px;
    border-radius: 0 0 12px 12px;
  `;

  const buttonStyles = `
    display: inline-block;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    padding: 14px 28px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin-top: 20px;
  `;

  const getIcon = () => {
    switch (type) {
      case 'contract_uploaded':
        return '📄';
      case 'analysis_complete':
        return '✅';
      case 'renewal_reminder':
        return '⏰';
      case 'high_risk_alert':
        return '⚠️';
      case 'compliance_alert':
        return '🔒';
      default:
        return '📬';
    }
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="${baseStyles}">
        <div style="${containerStyles}">
          <div style="${headerStyles}">
            <h1 style="margin: 0; font-size: 28px;">
              ${getIcon()} Contract IQ
            </h1>
          </div>
          <div style="${contentStyles}">
            <p style="font-size: 16px; margin-bottom: 10px;">Hi ${userName},</p>
            <h2 style="color: #1f2937; margin: 20px 0;">${title}</h2>
            <p style="font-size: 15px; color: #4b5563;">${message}</p>
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/contracts" style="${buttonStyles}">
              View Contracts
            </a>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280;">
              <p>This is an automated notification from Contract IQ. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Contract IQ. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}
