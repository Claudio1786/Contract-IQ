/**
 * File Storage Utilities
 * Epic 3: Task 3.1 - File Upload Infrastructure
 * 
 * Handles file uploads to local storage or cloud providers
 */

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface UploadedFile {
  filename: string;
  filepath: string;
  url: string;
  size: number;
  mimeType: string;
}

/**
 * Allowed file types for contract uploads
 */
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'text/plain',
];

export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

/**
 * Maximum file size (50 MB)
 */
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

/**
 * Validate file type and size
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(`.${extension}`)) {
      return {
        valid: false,
        error: 'Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed',
      };
    }
  }

  return { valid: true };
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalName: string, userId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const sanitizedName = originalName
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars
    .substring(0, 50); // Limit length

  return `${userId}_${timestamp}_${random}_${sanitizedName}.${extension}`;
}

/**
 * Save file to local storage
 */
export async function saveFileLocally(
  file: Buffer,
  filename: string,
  userId: string
): Promise<UploadedFile> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = join(process.cwd(), 'public', 'uploads', userId);
  
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  const filepath = join(uploadsDir, filename);
  await writeFile(filepath, file);

  return {
    filename,
    filepath: filepath,
    url: `/uploads/${userId}/${filename}`,
    size: file.length,
    mimeType: getMimeType(filename),
  };
}

/**
 * Get MIME type from filename
 */
function getMimeType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'doc':
      return 'application/msword';
    case 'txt':
      return 'text/plain';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Delete file from local storage
 */
export async function deleteFileLocally(filepath: string): Promise<void> {
  const { unlink } = await import('fs/promises');
  const { existsSync } = await import('fs');
  
  if (existsSync(filepath)) {
    await unlink(filepath);
  }
}
