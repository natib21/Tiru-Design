import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'INTERNAL_SERVER_ERROR';
    const extraFields: Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message = (responseObj.message as string) || message;
        error = (responseObj.error as string) || this.getErrorCode(status);
        
        // Preserve extra fields (like currentVersion) from the exception
        Object.keys(responseObj).forEach(key => {
          if (key !== 'message' && key !== 'error' && key !== 'statusCode') {
            extraFields[key] = responseObj[key];
          }
        });
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      
      // Preserve HTTP status from Express/body-parser errors
      const errorWithStatus = exception as Error & { status?: number; statusCode?: number; type?: string };
      if (errorWithStatus.status && errorWithStatus.status >= 400 && errorWithStatus.status < 600) {
        status = errorWithStatus.status;
        error = this.getErrorCode(status);
      } else if (errorWithStatus.statusCode && errorWithStatus.statusCode >= 400 && errorWithStatus.statusCode < 600) {
        status = errorWithStatus.statusCode;
        error = this.getErrorCode(status);
      } else if (errorWithStatus.type === 'entity.too.large') {
        status = HttpStatus.PAYLOAD_TOO_LARGE; // 413
        error = 'PAYLOAD_TOO_LARGE';
      }
      
      // Never expose stack traces in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('Unhandled exception:', exception);
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...extraFields,
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    const errorCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      413: 'PAYLOAD_TOO_LARGE',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE'
    };

    return errorCodes[status] || 'UNKNOWN_ERROR';
  }
}
