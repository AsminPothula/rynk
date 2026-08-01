import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError,
} from '@error';
import { LogService } from '@logger';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AppError } from '@types';

@Catch(AppError)
export class AppExceptionFilter implements ExceptionFilter {
  private _logger = new LogService(AppExceptionFilter.name);

  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 400;
    const error = new Error(exception.type);
    error.stack = exception.stack;
    this._logger.error(error);
    response.status(status).json({
      status,
      errors: [
        {
          type: exception.type,
          message: exception.message,
        },
      ],
      message: exception.message,
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private _logger = new LogService(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorResponse = exception.getResponse();
    let message: string;
    let errors: AppError[];
    if (exception instanceof UnauthorizedException) {
      const error = new UnauthorizedError();
      errors = [error];
      message = error.message;
    } else if (exception instanceof ForbiddenException) {
      const error = new ForbiddenError();
      errors = [error];
      message = error.message;
    } else if (exception instanceof InternalServerErrorException) {
      const error = new InternalServerError();
      errors = [error];
      message = error.message;
    } else {
      if (typeof errorResponse === 'string') {
        message = errorResponse;
        errors = [new BadRequestError()];
      } else {
        message = (errorResponse as any).message || '';
        errors =
          (errorResponse as any).errors?.map((error: any) => ({
            type: error?.type,
            message: error?.message,
          })) || [];
      }
    }

    this._logger.error(new Error(message));

    response.status(exception.getStatus()).json({
      status: exception.getStatus(),
      errors,
      message,
    });
  }
}
