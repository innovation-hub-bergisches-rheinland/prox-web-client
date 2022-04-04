import { KeycloakEventType, KeycloakService } from 'keycloak-angular';

import { environment } from '@env';

export function keycloakInitializer(keycloakService: KeycloakService): () => Promise<any> {
  return async (): Promise<any> => {
    const { keycloakConfig } = environment;
    await keycloakService.init({
      config: keycloakConfig,
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
      },
      bearerExcludedUrls: []
    });
    keycloakService.keycloakEvents$.subscribe({
      next: e => {
        if (e.type == KeycloakEventType.OnTokenExpired) {
          keycloakService.updateToken(20);
        }
      }
    });
  };
}
