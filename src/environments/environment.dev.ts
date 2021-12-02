import { KeycloakConfig } from 'keycloak-js';
import { Environment } from './IEnvironment';

const keycloakConfig: KeycloakConfig = {
  url: 'hhttps://login.aws.innovation-hub.de/auth',
  realm: 'innovation-hub-bergisches-rheinland',
  clientId: 'prox-web-client'
};

export const environment: Environment = {
  production: true,
  keycloakConfig,
  apiUrl: 'https://api.dev.prox.innovation-hub.de'
};
