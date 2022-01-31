import { APP_INITIALIZER, NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { throwIfAlreadyLoaded } from './guard/module-import.guard';
import { AuthGuard } from './guard/auth.guard';
import { keycloakInitializer } from './util/keycloak-init';

@NgModule({
  imports: [HttpClientModule, KeycloakAngularModule],
  providers: [
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      multi: true,
      deps: [KeycloakService]
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
