/**
 * Cron Job: Check Contract Renewals
 * Epic 7: Notifications & Alerts (Task 7.3)
 * 
 * Run daily to check for expiring contracts and send reminders
 * In production, trigger via:
 * - Vercel Cron
 * - GitHub Actions
 * - External cron service
 */

import { NextRequest } from 'next/server';
import { checkRenewalReminders } from '@/lib/notification-service';
import { successResponse, internalError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication for cron endpoint
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('🔄 Starting renewal reminder check...');
    
    await checkRenewalReminders();
    
    return successResponse({
      message: 'Renewal reminders checked successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return internalError('Failed to check renewal reminders');
  }
}
