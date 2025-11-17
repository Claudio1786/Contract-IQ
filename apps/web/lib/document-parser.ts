/**
 * Document Parser Utilities
 * Epic 3: Task 3.2 - Document Parsing
 * 
 * Extracts text content from PDF, DOCX, DOC, and TXT files
 */

import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { readFile } from 'fs/promises';

export interface ParsedDocument {
  text: string;
  pages?: number;
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
    creator?: string;
    producer?: string;
    creationDate?: string;
    modificationDate?: string;
    [key: string]: any;
  };
  wordCount: number;
  characterCount: number;
}

/**
 * Parse PDF document
 */
async function parsePDF(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const data = await pdf(buffer);

    return {
      text: data.text,
      pages: data.numpages,
      metadata: data.info,
      wordCount: countWords(data.text),
      characterCount: data.text.length,
    };
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${(error as Error).message}`);
  }
}

/**
 * Parse DOCX document
 */
async function parseDOCX(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    return {
      text,
      metadata: {},
      wordCount: countWords(text),
      characterCount: text.length,
    };
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${(error as Error).message}`);
  }
}

/**
 * Parse plain text document
 */
async function parseTXT(buffer: Buffer): Promise<ParsedDocument> {
  try {
    const text = buffer.toString('utf-8');

    return {
      text,
      metadata: {},
      wordCount: countWords(text),
      characterCount: text.length,
    };
  } catch (error) {
    throw new Error(`Failed to parse TXT: ${(error as Error).message}`);
  }
}

/**
 * Parse document by file type
 */
export async function parseDocument(
  filepath: string,
  mimeType: string
): Promise<ParsedDocument> {
  try {
    // Read file
    const buffer = await readFile(filepath);

    // Parse based on MIME type
    switch (mimeType) {
      case 'application/pdf':
        return await parsePDF(buffer);

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await parseDOCX(buffer);

      case 'application/msword':
        // DOC files - try DOCX parser (mammoth can sometimes handle .doc)
        return await parseDOCX(buffer);

      case 'text/plain':
        return await parseTXT(buffer);

      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    throw new Error(`Document parsing failed: ${(error as Error).message}`);
  }
}

/**
 * Parse document from buffer with file extension fallback
 */
export async function parseDocumentFromBuffer(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ParsedDocument> {
  try {
    // Parse based on MIME type
    switch (mimeType) {
      case 'application/pdf':
        return await parsePDF(buffer);

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return await parseDOCX(buffer);

      case 'application/msword':
        return await parseDOCX(buffer);

      case 'text/plain':
        return await parseTXT(buffer);

      default:
        // Fallback to file extension
        const extension = filename.split('.').pop()?.toLowerCase();
        if (extension === 'pdf') {
          return await parsePDF(buffer);
        } else if (extension === 'docx' || extension === 'doc') {
          return await parseDOCX(buffer);
        } else if (extension === 'txt') {
          return await parseTXT(buffer);
        }
        throw new Error(`Unsupported file type: ${mimeType}`);
    }
  } catch (error) {
    throw new Error(`Document parsing failed: ${(error as Error).message}`);
  }
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Extract key metadata from parsed document
 */
export function extractMetadata(parsed: ParsedDocument): {
  wordCount: number;
  characterCount: number;
  pages?: number;
  estimatedReadTime: number; // in minutes
} {
  // Estimate reading time (average 200 words per minute)
  const estimatedReadTime = Math.ceil(parsed.wordCount / 200);

  return {
    wordCount: parsed.wordCount,
    characterCount: parsed.characterCount,
    pages: parsed.pages,
    estimatedReadTime,
  };
}
