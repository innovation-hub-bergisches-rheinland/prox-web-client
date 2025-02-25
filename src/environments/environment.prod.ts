import { Environment } from './environment.types';
import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.realm-of-regret.de/auth',
  realm: 'innovation-hub-bergisches-rheinland',
  clientId: 'prox-web-client'
};

export const environment: Environment = {
  name: 'PROD',
  production: true,
  keycloakConfig,
  apiUrl: 'https://api.prox.realm-of-regret.de/v2',
  enabledFeatures: ['proposal'],
  loggingConfig: {
    error: true,
    debug: false,
    info: true,
    warn: true
  }
};
