// Contract Ingestion Pipeline for Railway + PostgreSQL
// Handles multiple input sources and normalizes contract data

import { v4 as uuidv4 } from 'uuid';

// Core ingestion interfaces
export interface ContractIngestionInput {
  source: IngestionSource;
  data: IngestionData;
  metadata: IngestionMetadata;
  processingOptions?: ProcessingOptions;
}

export interface IngestionSource {
  type: 'file_upload' | 'email_attachment' | 'clm_api' | 'url_fetch' | 'bulk_import';
  systemId?: string; // External system ID (e.g., Ironclad contract ID)
  systemName?: string; // System name (e.g., 'Ironclad', 'DocuSign CLM')
  apiEndpoint?: string;
  credentials?: Record<string, string>;
}

export interface IngestionData {
  // File data
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  content?: string; // Raw text or base64 for binary
  contentType?: 'text' | 'pdf' | 'docx' | 'html';
  
  // Email data
  emailData?: {
    from: string;
    subject: string;
    body: string;
    attachments: EmailAttachment[];
  };
  
  // API data
  apiData?: {
    contractId: string;
    lastModified: Date;
    version: string;
    rawResponse: any;
  };
}

export interface IngestionMetadata {
  userId: string;
  sessionId?: string;
  companyId?: string;
  uploadedAt: Date;
  originalSource: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  
  // Contract context
  contractContext?: {
    vendorName?: string;
    contractType?: string;
    estimatedValue?: number;
    renewalDate?: Date;
    department?: string;
    owner?: string;
  };
}

export interface ProcessingOptions {
  skipOcr?: boolean;
  skipExtraction?: boolean;
  priority?: 'low' | 'medium' | 'high';
  requiredAgents?: string[];
  notifyOnComplete?: boolean;
  webhookUrl?: string;
}

export interface EmailAttachment {
  filename: string;
  contentType: string;
  content: string; // base64 encoded
  size: number;
}

// Pipeline result interfaces
export interface IngestionResult {
  contractId: string;
  status: 'success' | 'partial' | 'failed';
  message: string;
  extractedText?: string;
  metadata: ProcessedMetadata;
  errors?: IngestionError[];
  warnings?: string[];
  processingTimeMs: number;
}

export interface ProcessedMetadata {
  originalFileName: string;
  extractedFileName?: string;
  contentLength: number;
  pageCount?: number;
  language?: string;
  encoding?: string;
  confidence?: number;
  extractionMethod: 'direct_text' | 'ocr' | 'api_extract';
}

export interface IngestionError {
  code: string;
  message: string;
  field?: string;
  recoverable: boolean;
}

// Main ingestion pipeline class
export class ContractIngestionPipeline {
  private readonly supportedFileTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'text/html',
    'application/rtf'
  ];

  async ingest(input: ContractIngestionInput): Promise<IngestionResult> {
    const startTime = Date.now();
    const contractId = uuidv4();
    
    try {
      // Validate input
      const validation = await this.validateInput(input);
      if (!validation.isValid) {
        return {
          contractId,
          status: 'failed',
          message: `Validation failed: ${validation.errors.join(', ')}`,
          errors: validation.errors.map(err => ({
            code: 'VALIDATION_ERROR',
            message: err,
            recoverable: false
          })),
          metadata: this.createEmptyMetadata(input),
          processingTimeMs: Date.now() - startTime
        };
      }

      // Route to appropriate processor based on source type
      let extractedText: string;
      let metadata: ProcessedMetadata;

      switch (input.source.type) {
        case 'file_upload':
          ({ extractedText, metadata } = await this.processFileUpload(input.data, contractId));
          break;
        case 'email_attachment':
          ({ extractedText, metadata } = await this.processEmailAttachment(input.data, contractId));
          break;
        case 'clm_api':
          ({ extractedText, metadata } = await this.processCLMAPI(input.source, input.data, contractId));
          break;
        case 'url_fetch':
          ({ extractedText, metadata } = await this.processURLFetch(input.data, contractId));
          break;
        case 'bulk_import':
          ({ extractedText, metadata } = await this.processBulkImport(input.data, contractId));
          break;
        default:
          throw new Error(`Unsupported source type: ${input.source.type}`);
      }

      // Store in database
      await this.storeContractData(contractId, extractedText, input, metadata);

      // Queue for agent processing if not skipped
      if (!input.processingOptions?.skipExtraction) {
        await this.queueForProcessing(contractId, input);
      }

      return {
        contractId,
        status: 'success',
        message: 'Contract ingested successfully',
        extractedText,
        metadata,
        processingTimeMs: Date.now() - startTime
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        contractId,
        status: 'failed',
        message: `Ingestion failed: ${errorMessage}`,
        errors: [{
          code: 'PROCESSING_ERROR',
          message: errorMessage,
          recoverable: true
        }],
        metadata: this.createEmptyMetadata(input),
        processingTimeMs: Date.now() - startTime
      };
    }
  }

  private async validateInput(input: ContractIngestionInput): Promise<ValidationResult> {
    const errors: string[] = [];

    // Validate source
    if (!input.source?.type) {
      errors.push('Source type is required');
    }

    // Validate data based on source type
    switch (input.source.type) {
      case 'file_upload':
        if (!input.data.content) {
          errors.push('File content is required');
        }
        if (!input.data.fileName) {
          errors.push('File name is required');
        }
        if (input.data.contentType && !this.isFileTypeSupported(input.data.contentType)) {
          errors.push(`Unsupported file type: ${input.data.contentType}`);
        }
        break;

      case 'email_attachment':
        if (!input.data.emailData) {
          errors.push('Email data is required');
        } else if (!input.data.emailData.attachments?.length) {
          errors.push('Email must contain at least one attachment');
        }
        break;

      case 'clm_api':
        if (!input.source.apiEndpoint) {
          errors.push('API endpoint is required for CLM integration');
        }
        if (!input.data.apiData?.contractId) {
          errors.push('Contract ID is required for API ingestion');
        }
        break;
    }

    // Validate metadata
    if (!input.metadata?.userId) {
      errors.push('User ID is required');
    }

    // Validate file size (100MB limit)
    const maxSizeMB = 100;
    if (input.data.fileSize && input.data.fileSize > maxSizeMB * 1024 * 1024) {
      errors.push(`File size exceeds ${maxSizeMB}MB limit`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isFileTypeSupported(contentType: string): boolean {
    return this.supportedFileTypes.includes(contentType);
  }

  // File upload processor
  private async processFileUpload(data: IngestionData, contractId: string): Promise<{ extractedText: string; metadata: ProcessedMetadata }> {
    if (!data.content || !data.fileName) {
      throw new Error('Invalid file upload data');
    }

    let extractedText: string;
    let extractionMethod: ProcessedMetadata['extractionMethod'];

    try {
      // Handle different content types
      switch (data.contentType) {
        case 'text':
          extractedText = data.content;
          extractionMethod = 'direct_text';
          break;
        
        case 'pdf':
          extractedText = await this.extractPDFText(data.content);
          extractionMethod = 'api_extract';
          break;
        
        case 'docx':
          extractedText = await this.extractDocxText(data.content);
          extractionMethod = 'api_extract';
          break;
        
        default:
          // Fallback: treat as text
          extractedText = data.content;
          extractionMethod = 'direct_text';
      }

      // Clean and validate extracted text
      extractedText = this.cleanExtractedText(extractedText);
      
      if (extractedText.length < 100) {
        throw new Error('Extracted text is too short to be a valid contract');
      }

      return {
        extractedText,
        metadata: {
          originalFileName: data.fileName,
          contentLength: extractedText.length,
          extractionMethod,
          confidence: this.calculateExtractionConfidence(extractedText),
        }
      };

    } catch (error) {
      throw new Error(`File processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Email attachment processor
  private async processEmailAttachment(data: IngestionData, contractId: string): Promise<{ extractedText: string; metadata: ProcessedMetadata }> {
    if (!data.emailData?.attachments?.length) {
      throw new Error('No attachments found in email');
    }

    // Process the first valid attachment (could be extended to handle multiple)
    const attachment = data.emailData.attachments.find(att => 
      this.isFileTypeSupported(att.contentType)
    );

    if (!attachment) {
      throw new Error('No supported attachments found');
    }

    // Convert attachment to file upload format and process
    const fileData: IngestionData = {
      fileName: attachment.filename,
      fileType: attachment.contentType,
      fileSize: attachment.size,
      content: attachment.content,
      contentType: this.mapMimeTypeToContentType(attachment.contentType),
    };

    return this.processFileUpload(fileData, contractId);
  }

  // CLM API processor
  private async processCLMAPI(source: IngestionSource, data: IngestionData, contractId: string): Promise<{ extractedText: string; metadata: ProcessedMetadata }> {
    if (!source.apiEndpoint || !data.apiData?.contractId) {
      throw new Error('Invalid CLM API configuration');
    }

    try {
      // This would integrate with various CLM systems
      // For now, we'll simulate the API call
      const apiResponse = await this.callCLMAPI(source, data.apiData.contractId);
      
      return {
        extractedText: apiResponse.content,
        metadata: {
          originalFileName: `${source.systemName}_${data.apiData.contractId}.pdf`,
          contentLength: apiResponse.content.length,
          extractionMethod: 'api_extract',
          confidence: 0.95, // API extractions are usually high confidence
        }
      };

    } catch (error) {
      throw new Error(`CLM API processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // URL fetch processor
  private async processURLFetch(data: IngestionData, contractId: string): Promise<{ extractedText: string; metadata: ProcessedMetadata }> {
    // Implementation for fetching contracts from URLs
    throw new Error('URL fetch not yet implemented');
  }

  // Bulk import processor
  private async processBulkImport(data: IngestionData, contractId: string): Promise<{ extractedText: string; metadata: ProcessedMetadata }> {
    // Implementation for bulk imports
    throw new Error('Bulk import not yet implemented');
  }

  // Text extraction methods
  private async extractPDFText(base64Content: string): Promise<string> {
    // In production, this would use a PDF parsing library
    // For now, return placeholder
    return `[PDF content extraction would happen here for base64 content of length ${base64Content.length}]`;
  }

  private async extractDocxText(base64Content: string): Promise<string> {
    // In production, this would use a DOCX parsing library
    // For now, return placeholder
    return `[DOCX content extraction would happen here for base64 content of length ${base64Content.length}]`;
  }

  // Text cleaning and validation
  private cleanExtractedText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private calculateExtractionConfidence(text: string): number {
    // Simple heuristics for extraction confidence
    let confidence = 0.7; // Base confidence

    // Check for contract indicators
    const contractKeywords = ['agreement', 'contract', 'terms', 'conditions', 'party', 'whereas'];
    const keywordMatches = contractKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length;
    
    confidence += (keywordMatches / contractKeywords.length) * 0.2;

    // Check text length (longer = more confident)
    if (text.length > 5000) confidence += 0.1;
    if (text.length > 10000) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  // Database storage
  private async storeContractData(
    contractId: string, 
    extractedText: string, 
    input: ContractIngestionInput, 
    metadata: ProcessedMetadata
  ): Promise<void> {
    // This would use your PostgreSQL database
    // For now, just log the storage operation
    console.log(`Storing contract ${contractId} with ${extractedText.length} characters`);
    
    // In production:
    // await db.contracts.create({
    //   id: contractId,
    //   userId: input.metadata.userId,
    //   content: extractedText,
    //   originalFileName: metadata.originalFileName,
    //   extractionMethod: metadata.extractionMethod,
    //   // ... other fields
    // });
  }

  // Queue for agent processing
  private async queueForProcessing(contractId: string, input: ContractIngestionInput): Promise<void> {
    // This would queue the contract for agent processing
    // Could use Redis, PostgreSQL, or Railway's job queue
    console.log(`Queuing contract ${contractId} for agent processing`);
    
    // In production:
    // await jobQueue.add('process-contract', {
    //   contractId,
    //   requiredAgents: input.processingOptions?.requiredAgents,
    //   priority: input.processingOptions?.priority || 'medium'
    // });
  }

  // CLM API integration
  private async callCLMAPI(source: IngestionSource, contractId: string): Promise<CLMAPIResponse> {
    // Mock implementation - would integrate with real CLM APIs
    return {
      content: `Mock contract content from ${source.systemName} for contract ${contractId}`,
      metadata: {
        lastModified: new Date(),
        version: '1.0'
      }
    };
  }

  // Utility methods
  private mapMimeTypeToContentType(mimeType: string): IngestionData['contentType'] {
    const mimeMap: Record<string, IngestionData['contentType']> = {
      'application/pdf': 'pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/msword': 'docx',
      'text/plain': 'text',
      'text/html': 'html',
    };
    
    return mimeMap[mimeType] || 'text';
  }

  private createEmptyMetadata(input: ContractIngestionInput): ProcessedMetadata {
    return {
      originalFileName: input.data.fileName || 'unknown',
      contentLength: 0,
      extractionMethod: 'direct_text',
      confidence: 0,
    };
  }
}

// Supporting interfaces
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

interface CLMAPIResponse {
  content: string;
  metadata: {
    lastModified: Date;
    version: string;
  };
}

// CLM Integration Templates
export const CLM_INTEGRATIONS = {
  ironclad: {
    name: 'Ironclad',
    apiEndpoint: 'https://ironcladapp.com/public-api/v1',
    authentication: 'bearer_token',
    contractEndpoint: '/contracts/{id}/export',
    supportedFormats: ['pdf', 'docx']
  },
  
  docusign: {
    name: 'DocuSign CLM',
    apiEndpoint: 'https://api.docusign.net/v2.1',
    authentication: 'oauth2',
    contractEndpoint: '/accounts/{accountId}/envelopes/{envelopeId}/documents',
    supportedFormats: ['pdf']
  },
  
  contractworks: {
    name: 'ContractWorks',
    apiEndpoint: 'https://api.contractworks.com/v1',
    authentication: 'api_key',
    contractEndpoint: '/contracts/{id}',
    supportedFormats: ['pdf', 'docx']
  },
  
  agiloft: {
    name: 'Agiloft',
    apiEndpoint: 'https://{instance}.agiloft.com/api',
    authentication: 'basic_auth',
    contractEndpoint: '/contracts/{id}/export',
    supportedFormats: ['pdf', 'docx', 'html']
  }
};

export default ContractIngestionPipeline;