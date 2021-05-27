import { KeycloakEventType, KeycloakService } from 'keycloak-angular';

import { environment } from '@env';

export function keycloakInitializer(
  keycloakService: KeycloakService
): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const { keycloakConfig } = environment;
      try {
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
        resolve(undefined);
      } catch (error) {
        reject(error);
      }
    });
  };
}
