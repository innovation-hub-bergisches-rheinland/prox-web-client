import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '@shared/modules/logger/logger.service';

@Injectable()
export class LoggerInterceptor implements HttpInterceptor {
  constructor(private loggerService: LoggerService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError(err => {
        this.loggerService.error(err);
        return throwError(() => err);
      })
    );
  }
}
