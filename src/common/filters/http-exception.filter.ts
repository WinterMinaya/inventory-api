import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.message;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string | string[]) || exception.message;
        error = (resp.error as string) || exception.name;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Error no manejado: ${exception.message}`, exception.stack);
    }

    // Para errores de validación, message puede ser un array
    const errorMessages = Array.isArray(message) ? message : [message];

    const errorResponse = {
      success: false,
      statusCode: status,
      error,
      messages: errorMessages,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.warn(
      `${request.method} ${request.url} - ${status} - ${errorMessages.join(', ')}`,
    );

    response.status(status).json(errorResponse);
  }
}

