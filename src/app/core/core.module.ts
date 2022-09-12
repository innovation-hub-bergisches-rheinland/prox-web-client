import { APP_INITIALIZER, ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { throwIfAlreadyLoaded } from './guard/module-import.guard';
import { AuthGuard } from './guard/auth.guard';
import { keycloakInitializer } from './util/keycloak-init';
import { ShimmerInterceptor } from '@app/interceptor/shimmer.interceptor';
import { FeatureService } from './service/feature.service';
import { GlobalErrorHandler } from './errors/global-error-handler';
import { LoggerInterceptor } from './interceptor/logger-interceptor.service';

@NgModule({
  imports: [HttpClientModule, KeycloakAngularModule],
  providers: [
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      multi: true,
      deps: [KeycloakService, FeatureService]
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ShimmerInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggerInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
