import { Environment } from './IEnvironment';
import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.archi-lab.io/auth',
  realm: 'archilab',
  clientId: 'prox-web-client'
};

export const environment: Environment = {
  production: true,
  keycloakConfig,
  apiUrl: 'https://api.prox.innovation-hub.de'
};