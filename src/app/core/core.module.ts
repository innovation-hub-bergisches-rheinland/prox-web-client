import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';

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
