import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ShimmerService } from '@layout/shimmer/shimmer.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ShimmerInterceptor implements HttpInterceptor {
  private _reqCount = 0;

  constructor(private shimmerService: ShimmerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (++this._reqCount === 1) {
      this.shimmerService.pushState(true);
    }
    return next.handle(request).pipe(
      tap(() => {
        if (--this._reqCount === 0) {
          this.shimmerService.pushState(false);
        }
      })
    );
  }
}
