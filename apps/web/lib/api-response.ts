/**
 * API Response Helpers
 * Epic 2: Task 2.3 - Error Handling Patterns
 * 
 * Standardized API response format and error handling
 */

import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Error response helper
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = 500,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
    { status }
  );
}

/**
 * Validation error response
 */
export function validationError(
  message: string,
  details?: any
): NextResponse<ApiResponse> {
  return errorResponse('VALIDATION_ERROR', message, 400, details);
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(
  message: string = 'Unauthorized'
): NextResponse<ApiResponse> {
  return errorResponse('UNAUTHORIZED', message, 401);
}

/**
 * Forbidden error response
 */
export function forbiddenError(
  message: string = 'Forbidden'
): NextResponse<ApiResponse> {
  return errorResponse('FORBIDDEN', message, 403);
}

/**
 * Not found error response
 */
export function notFoundError(
  resource: string = 'Resource'
): NextResponse<ApiResponse> {
  return errorResponse('NOT_FOUND', `${resource} not found`, 404);
}

/**
 * Conflict error response
 */
export function conflictError(
  message: string
): NextResponse<ApiResponse> {
  return errorResponse('CONFLICT', message, 409);
}

/**
 * Internal server error response
 */
export function internalError(
  message: string = 'Internal server error'
): NextResponse<ApiResponse> {
  return errorResponse('INTERNAL_ERROR', message, 500);
}

/**
 * Rate limit error response
 */
export function rateLimitError(
  message: string = 'Too many requests'
): NextResponse<ApiResponse> {
  return errorResponse('RATE_LIMIT_EXCEEDED', message, 429);
}

/**
 * Error handler wrapper for API routes
 */
export function withErrorHandler<T>(
  handler: (req: Request, ...args: any[]) => Promise<NextResponse<T>>
) {
  return async (req: Request, ...args: any[]): Promise<NextResponse<any>> => {
    try {
      return await handler(req, ...args);
    } catch (error: any) {
      console.error('API Error:', error);

      // Handle known error types
      if (error.code === 'P2002') {
        // Prisma unique constraint violation
        return conflictError('Resource already exists');
      }

      if (error.code === 'P2025') {
        // Prisma record not found
        return notFoundError();
      }

      if (error.name === 'ValidationError') {
        return validationError(error.message, error.details);
      }

      // Default to internal error
      return internalError(
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'An unexpected error occurred'
      );
    }
  };
}
