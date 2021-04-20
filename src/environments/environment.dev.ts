import { KeycloakConfig } from 'keycloak-js';
import { Environment } from './IEnvironment';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.archi-lab.io/auth',
  realm: 'archilab',
  clientId: 'prox-web-client'
};

export const environment: Environment = {
  production: true,
  keycloakConfig,
  apiUrl: 'https://api.dev.prox.innovation-hub.de'
};
