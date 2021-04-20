import { KeycloakConfig } from 'keycloak-js';
import { Environment } from './IEnvironment';

const keycloakConfig: KeycloakConfig = {
  url: 'http://127.0.0.1:8080/auth',
  realm: 'archilab',
  clientId: 'prox-web-client'
};

export const environment: Environment = {
  production: false,
  keycloakConfig,
  apiUrl: 'http://127.0.0.1:8081'
};
