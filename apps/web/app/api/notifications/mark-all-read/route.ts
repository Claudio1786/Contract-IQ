/**
 * Mark All Notifications as Read API
 * Epic 7: Notifications & Alerts (Task 7.1)
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  successResponse,
  unauthorizedError,
  internalError,
} from '@/lib/api-response';

/**
 * POST - Mark all user notifications as read
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    // Update all unread notifications for this user
    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return successResponse({
      message: 'All notifications marked as read',
      count: result.count,
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    return internalError('Failed to mark notifications as read');
  }
}
