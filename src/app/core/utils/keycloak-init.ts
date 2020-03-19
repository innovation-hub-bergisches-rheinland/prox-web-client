import { KeycloakService } from 'keycloak-angular';
import { environment } from '@environment/environment';

export function keycloakInitializer(
  keycloak: KeycloakService
): () => Promise<any> {
  return () =>
    keycloak.init({
      config: environment.keycloakConfig,
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: true
      },
      // disable default interceptor, we use custom interceptor(bearer.interceptor.ts)
      enableBearerInterceptor: false
    });
}
