import { KeycloakEventType, KeycloakService } from 'keycloak-angular';

import { environment } from '@env';
import { FeatureService } from '@app/service/feature.service';
import { KeycloakTokenParsed } from 'keycloak-js';

export function keycloakInitializer(keycloakService: KeycloakService, featureService: FeatureService): () => Promise<any> {
  return async (): Promise<any> => {
    const updateFeaturesFromToken = (token: KeycloakTokenParsed) => {
      if (token?.features) {
        const { features } = token;
        featureService.set(features);
      }
    };

    const { keycloakConfig } = environment;
    await keycloakService.init({
      config: keycloakConfig,
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
      },
      bearerExcludedUrls: []
    });

    // Assuming we have an access token now
    updateFeaturesFromToken(keycloakService.getKeycloakInstance().tokenParsed);

    keycloakService.keycloakEvents$.subscribe({
      next: async e => {
        console.log(e);
        if (e.type == KeycloakEventType.OnTokenExpired) {
          keycloakService.updateToken(20);
        }
        if ([KeycloakEventType.OnAuthRefreshSuccess, KeycloakEventType.OnAuthSuccess, KeycloakEventType.OnAuthSuccess].includes(e.type)) {
          updateFeaturesFromToken(keycloakService.getKeycloakInstance().tokenParsed);
        }
      }
    });
  };
}
