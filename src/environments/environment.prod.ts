import { Environment } from './environment.types';
import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.aws.innovation-hub.de/auth',
  realm: 'innovation-hub-bergisches-rheinland',
  clientId: 'prox-web-client'
};

export const environment: Environment = {
  production: true,
  keycloakConfig,
  apiUrl: 'https://api.prox.aws.innovation-hub.de/v2',
  enabledFeatures: ['proposal'],
  loggingConfig: {
    error: true,
    debug: false,
    info: true,
    warn: true
  }
};
