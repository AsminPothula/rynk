import {
  CacheInterceptor,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { LogService } from './logger.js';

import { Config } from '@config';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private _logger = new LogService('REQUEST');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        if (!(request.url as string).startsWith('/status')) {
          this._logger.log(
            `${request.method}${
              typeof request.cacheHit === 'boolean'
                ? ` [Cache Hit: ${request.cacheHit}]`
                : ''
            } - ${request.url}: ${Date.now() - now}ms`,
          );
        }
      }),
    );
  }
}

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    return `${Config.Server.Env}:${request.url}`;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const middleware: CallHandler = {
      handle: () => {
        request.cacheHit = false;
        return next.handle();
      },
    };
    const observable = await super.intercept(context, middleware);
    return observable.pipe(
      tap(() => {
        if (request.cacheHit !== false) {
          request.cacheHit = true;
        }
      }),
    );
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly timeoutMs: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new Error('Request timed out.'));
        }
        return throwError(() => err);
      }),
    );
  }
}
