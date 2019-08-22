import { KeycloakConfig } from 'keycloak-angular';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.archi-lab.io/auth',
  realm: 'archilab',
  clientId: 'prox-web-client'
};

export const environment = {
  production: true,
  keycloak: keycloakConfig,
  url: 'https://api.prox.archi-lab.io'
};
