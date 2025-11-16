/**
 * Single Notification API
 * Epic 7: Notifications & Alerts (Task 7.1)
 * 
 * Mark as read/unread, delete notifications
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  successResponse,
  unauthorizedError,
  notFoundError,
  internalError,
} from '@/lib/api-response';

/**
 * PATCH - Mark notification as read/unread
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const body = await request.json();
    const { read } = body;

    if (typeof read !== 'boolean') {
      return notFoundError('read field must be a boolean');
    }

    // Verify ownership
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return notFoundError('Notification');
    }

    // Update
    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read },
    });

    return successResponse({
      notification: updated,
      message: `Notification marked as ${read ? 'read' : 'unread'}`,
    });
  } catch (error) {
    console.error('Update notification error:', error);
    return internalError('Failed to update notification');
  }
}

/**
 * DELETE - Delete notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    // Verify ownership
    const notification = await prisma.notification.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!notification) {
      return notFoundError('Notification');
    }

    // Delete
    await prisma.notification.delete({
      where: { id: params.id },
    });

    return successResponse({
      message: 'Notification deleted',
      notificationId: params.id,
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    return internalError('Failed to delete notification');
  }
}
