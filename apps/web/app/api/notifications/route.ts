/**
 * Notifications API
 * Epic 7: Notifications & Alerts (Task 7.1)
 * 
 * Manage user notifications
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  successResponse,
  unauthorizedError,
  validationError,
  internalError,
} from '@/lib/api-response';

/**
 * GET - Get user notifications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = { userId: session.user.id };
    if (unreadOnly) {
      where.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100), // Max 100
    });

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        read: false,
      },
    });

    return successResponse({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return internalError('Failed to get notifications');
  }
}

/**
 * POST - Create notification (internal use)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const body = await request.json();
    const { type, title, message, contractId } = body;

    // Validate
    if (!type || !title || !message) {
      return validationError('Type, title, and message are required');
    }

    const validTypes = [
      'contract_uploaded',
      'analysis_complete',
      'renewal_reminder',
      'high_risk_alert',
      'compliance_alert',
      'system',
    ];

    if (!validTypes.includes(type)) {
      return validationError('Invalid notification type');
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: session.user.id,
        type,
        title,
        message,
        contractId: contractId || null,
        read: false,
      },
    });

    return successResponse({
      notification,
      message: 'Notification created',
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return internalError('Failed to create notification');
  }
}
