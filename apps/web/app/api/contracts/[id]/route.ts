/**
 * Contract CRUD API
 * Epic 6: Contract Management
 * 
 * Handles contract viewing, editing, and deletion
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
import { deleteFileLocally } from '@/lib/file-storage';

/**
 * GET - Get contract details with analysis
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

    // Get contract with full details
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
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

    if (!contract) {
      return notFoundError('Contract');
    }

    return successResponse({ contract });
  } catch (error) {
    console.error('Get contract error:', error);
    return internalError('Failed to get contract');
  }
}

/**
 * PATCH - Update contract metadata
 */
export async function PATCH(
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

    // Validate update data
    const updateData: any = {};
    
    if (body.title !== undefined) {
      if (!body.title || body.title.trim().length === 0) {
        return validationError('Title cannot be empty');
      }
      updateData.title = body.title.trim();
    }

    if (body.vendor !== undefined) {
      updateData.vendor = body.vendor ? body.vendor.trim() : null;
    }

    if (body.value !== undefined) {
      if (body.value !== null && (typeof body.value !== 'number' || body.value < 0)) {
        return validationError('Value must be a positive number');
      }
      updateData.value = body.value;
    }

    if (body.startDate !== undefined) {
      updateData.startDate = body.startDate ? new Date(body.startDate) : null;
    }

    if (body.endDate !== undefined) {
      updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    }

    // Update contract
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: updateData,
      include: {
        analysis: true,
        tags: true,
      },
    });

    return successResponse({
      contract: updatedContract,
      message: 'Contract updated successfully',
    });
  } catch (error) {
    console.error('Update contract error:', error);
    return internalError('Failed to update contract');
  }
}

/**
 * DELETE - Delete contract and associated data
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

    // Get contract to delete file
    const contract = await prisma.contract.findFirst({
      where: {
        id: contractId,
        userId: session.user.id,
      },
    });

    if (!contract) {
      return notFoundError('Contract');
    }

    // Delete analysis first (cascade)
    await prisma.analysis.deleteMany({
      where: { contractId },
    });

    // Delete tags
    await prisma.contractTag.deleteMany({
      where: { contractId },
    });

    // Delete contract
    await prisma.contract.delete({
      where: { id: contractId },
    });

    // Delete file from storage
    try {
      // Extract file path from URL
      const filePathMatch = contract.fileUrl.match(/\/uploads\/(.+)/);
      if (filePathMatch) {
        const fullPath = `public${contract.fileUrl}`;
        await deleteFileLocally(fullPath);
      }
    } catch (fileError) {
      console.error('File deletion error:', fileError);
      // Continue - file may already be deleted
    }

    return successResponse({
      message: 'Contract deleted successfully',
      contractId,
    });
  } catch (error) {
    console.error('Delete contract error:', error);
    return internalError('Failed to delete contract');
  }
}
