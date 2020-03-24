import { NgModule, Optional, SkipSelf, APP_INITIALIZER } from '@angular/core';
import { throwIfAlreadyLoaded } from './guard/module-import.guard';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './guard/auth.guard';
import { keycloakInitializer } from './util/keycloak-init';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { AngularHalModule } from 'angular4-hal';
import { ExternalConfigurationService } from './service/external-configuration.service';

@NgModule({
  imports: [
    HttpClientModule,
    KeycloakAngularModule,
    AngularHalModule.forRoot()
  ],
  providers: [
    AuthGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: keycloakInitializer,
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: 'ExternalConfigurationService',
      useClass: ExternalConfigurationService
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
