/**
 * Database Helper Functions
 * Epic 2: Task 2.2 - API Helper Functions
 * 
 * Reusable database query helpers and utilities
 */

import prisma from './prisma';
import type { Prisma } from '@prisma/client';

/**
 * Pagination helper
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export async function paginate<T>(
  model: any,
  where: any = {},
  params: PaginationParams = {},
  orderBy: any = { createdAt: 'desc' }
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize || 10));
  const skip = (page - 1) * pageSize;

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
    }),
    model.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

/**
 * Contract query helpers
 */
export async function findContractsByUser(userId: string, filters: {
  status?: string;
  vendor?: string;
  tag?: string;
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: Prisma.ContractWhereInput = {
    userId,
  };

  if (filters.status) {
    where.status = filters.status as any;
  }

  if (filters.vendor) {
    where.vendor = {
      contains: filters.vendor,
      mode: 'insensitive',
    };
  }

  if (filters.tag) {
    where.tags = {
      some: {
        tag: filters.tag,
      },
    };
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { vendor: { contains: filters.search, mode: 'insensitive' } },
      { fileName: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return paginate(
    prisma.contract,
    where,
    { page: filters.page, pageSize: filters.pageSize },
    { uploadedAt: 'desc' }
  );
}

/**
 * Get contract with full details
 */
export async function getContractWithAnalysis(contractId: string, userId: string) {
  return prisma.contract.findFirst({
    where: {
      id: contractId,
      userId,
    },
    include: {
      analysis: true,
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get user statistics
 */
export async function getUserStats(userId: string) {
  const [
    totalContracts,
    analyzedContracts,
    pendingContracts,
    highRiskContracts,
    totalContractValue,
    expiringContracts,
  ] = await Promise.all([
    prisma.contract.count({ where: { userId } }),
    prisma.contract.count({ where: { userId, status: 'ANALYZED' } }),
    prisma.contract.count({ where: { userId, status: 'PENDING' } }),
    prisma.analysis.count({
      where: {
        contract: { userId },
        riskLevel: 'HIGH',
      },
    }),
    prisma.contract.aggregate({
      where: { userId, value: { not: null } },
      _sum: { value: true },
    }),
    prisma.contract.count({
      where: {
        userId,
        endDate: {
          lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          gte: new Date(),
        },
      },
    }),
  ]);

  return {
    totalContracts,
    analyzedContracts,
    pendingContracts,
    highRiskContracts,
    totalContractValue: totalContractValue._sum.value || 0,
    expiringContracts,
    analysisRate: totalContracts > 0
      ? Math.round((analyzedContracts / totalContracts) * 100)
      : 0,
  };
}

/**
 * Get notifications for user
 */
export async function getUnreadNotifications(userId: string) {
  return prisma.notification.findMany({
    where: {
      userId,
      read: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });
}

/**
 * Mark notifications as read
 */
export async function markNotificationsAsRead(userId: string, notificationIds?: string[]) {
  const where: Prisma.NotificationWhereInput = { userId };

  if (notificationIds && notificationIds.length > 0) {
    where.id = { in: notificationIds };
  }

  return prisma.notification.updateMany({
    where,
    data: { read: true },
  });
}

/**
 * Get recent conversations
 */
export async function getRecentConversations(userId: string, limit: number = 10) {
  return prisma.conversation.findMany({
    where: { userId },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });
}

/**
 * Get conversation with messages
 */
export async function getConversationWithMessages(
  conversationId: string,
  userId: string,
  limit: number = 50
) {
  return prisma.conversation.findFirst({
    where: {
      id: conversationId,
      userId,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        take: limit,
      },
    },
  });
}

/**
 * Search contracts (full-text search simulation)
 */
export async function searchContracts(userId: string, query: string, limit: number = 20) {
  return prisma.contract.findMany({
    where: {
      userId,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { vendor: { contains: query, mode: 'insensitive' } },
        { fileName: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      analysis: {
        select: {
          riskLevel: true,
          riskScore: true,
        },
      },
      tags: true,
    },
    orderBy: { uploadedAt: 'desc' },
    take: limit,
  });
}

/**
 * Get dashboard summary data
 */
export async function getDashboardSummary(userId: string) {
  const [
    stats,
    recentContracts,
    highRiskContracts,
    expiringContracts,
    unreadNotifications,
  ] = await Promise.all([
    getUserStats(userId),
    prisma.contract.findMany({
      where: { userId },
      include: {
        analysis: {
          select: {
            riskLevel: true,
            riskScore: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
      take: 5,
    }),
    prisma.contract.findMany({
      where: {
        userId,
        analysis: {
          riskLevel: 'HIGH',
        },
      },
      include: {
        analysis: {
          select: {
            riskLevel: true,
            riskScore: true,
            liabilityRisks: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
      take: 5,
    }),
    prisma.contract.findMany({
      where: {
        userId,
        endDate: {
          lte: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          gte: new Date(),
        },
      },
      orderBy: { endDate: 'asc' },
      take: 5,
    }),
    getUnreadNotifications(userId),
  ]);

  return {
    stats,
    recentContracts,
    highRiskContracts,
    expiringContracts,
    unreadNotifications,
  };
}
