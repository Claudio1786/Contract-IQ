/**
 * Contract Tags API
 * Epic 6: Contract Management (Task 6.4)
 * 
 * Manage tags on contracts
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  successResponse,
  unauthorizedError,
  notFoundError,
  validationError,
  internalError,
} from '@/lib/api-response';

/**
 * POST - Add tag to contract
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const contractId = params.id;
    const body = await request.json();

    // Verify contract ownership
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
      },
    });

    if (!contract) {
      return notFoundError('Contract');
    }

    // Validate tag data
    const { name, color } = body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return validationError('Tag name is required');
    }

    const tagName = name.trim().toLowerCase();
    const tagColor = color || '#3B82F6'; // Default blue

    // Check if tag already exists for this contract
    const existingTag = await prisma.contractTag.findFirst({
      where: {
        contractId,
        name: tagName,
      },
    });

    if (existingTag) {
      return validationError('Tag already exists on this contract');
    }

    // Create tag
    const tag = await prisma.contractTag.create({
      data: {
        contractId,
        name: tagName,
        color: tagColor,
      },
    });

    return successResponse({
      tag,
      message: 'Tag added successfully',
    });
  } catch (error) {
    console.error('Add tag error:', error);
    return internalError('Failed to add tag');
  }
}

/**
 * DELETE - Remove tag from contract
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const contractId = params.id;
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');

    if (!tagId) {
      return validationError('tagId query parameter is required');
    }

    // Verify contract ownership
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
      },
    });

    if (!contract) {
      return notFoundError('Contract');
    }

    // Verify tag exists and belongs to this contract
    const tag = await prisma.contractTag.findFirst({
      where: {
        id: tagId,
        contractId,
      },
    });

    if (!tag) {
      return notFoundError('Tag');
    }

    // Delete tag
    await prisma.contractTag.delete({
      where: { id: tagId },
    });

    return successResponse({
      message: 'Tag removed successfully',
      tagId,
    });
  } catch (error) {
    console.error('Remove tag error:', error);
    return internalError('Failed to remove tag');
  }
}

/**
 * GET - Get all tags for a contract
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    const contractId = params.id;

    // Verify contract ownership
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
      },
    });

    if (!contract) {
      return notFoundError('Contract');
    }

    // Get all tags
    const tags = await prisma.contractTag.findMany({
      where: { contractId },
      orderBy: { name: 'asc' },
    });

    return successResponse({ tags });
  } catch (error) {
    console.error('Get tags error:', error);
    return internalError('Failed to get tags');
  }
}
