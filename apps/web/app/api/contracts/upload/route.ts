/**
 * Contract Upload API
 * Epic 3: Task 3.1 - File Upload Infrastructure
 * 
 * Handles contract file uploads with validation
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
import {
  generateUniqueFilename,
  saveFileLocally,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from '@/lib/file-storage';
import { parseDocumentFromBuffer, extractMetadata } from '@/lib/document-parser';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return unauthorizedError();
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file) {
      return validationError('No file provided');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return validationError(
        `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB`
      );
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return validationError(
        'Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed'
      );
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name, session.user.id);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const uploadedFile = await saveFileLocally(
      buffer,
      filename,
      session.user.id
    );

    // Parse document to extract text
    let parsedDocument = null;
    let extractedText = null;
    let documentMetadata = null;

    try {
      parsedDocument = await parseDocumentFromBuffer(
        buffer,
        file.name,
        uploadedFile.mimeType
      );
      extractedText = parsedDocument.text;
      documentMetadata = extractMetadata(parsedDocument);
    } catch (parseError) {
      console.error('Document parsing error:', parseError);
      // Continue with upload even if parsing fails
      // We'll retry parsing later
    }

    // Create database record
    const contract = await prisma.contract.create({
      data: {
        userId: session.user.id,
        title: title || file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        fileName: file.name,
        fileUrl: uploadedFile.url,
        fileSize: file.size,
        mimeType: uploadedFile.mimeType,
        extractedText: extractedText,
        status: parsedDocument ? 'PROCESSING' : 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Trigger AI analysis in background (Epic 4)
    if (extractedText) {
      // Queue analysis (fire and forget)
      fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/contracts/${contract.id}/analyze`, {
        method: 'POST',
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        },
      }).catch(err => console.error('Background analysis failed:', err));
    }

    return successResponse(
      {
        contract,
        documentMetadata,
        parsed: !!parsedDocument,
        message: parsedDocument
          ? 'Contract uploaded and parsed successfully'
          : 'Contract uploaded successfully (parsing pending)',
      },
      201
    );
  } catch (error) {
    console.error('Upload error:', error);
    return internalError('Failed to upload contract');
  }
}

/**
 * Get upload limits info
 */
export async function GET() {
  return successResponse({
    maxFileSize: MAX_FILE_SIZE,
    maxFileSizeMB: MAX_FILE_SIZE / (1024 * 1024),
    allowedTypes: ALLOWED_FILE_TYPES,
    allowedExtensions: ['pdf', 'docx', 'doc', 'txt'],
  });
}
