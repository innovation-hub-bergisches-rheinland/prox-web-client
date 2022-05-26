// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { KeycloakConfig } from 'keycloak-js';
import { Environment } from './environment.types';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.aws.innovation-hub.de/auth',
  realm: 'innovation-hub-bergisches-rheinland',
  clientId: 'prox-web-client-dev-local'
};

export const environment: Environment = {
  production: false,
  keycloakConfig,
  // apiUrl: 'https://api.prox.aws.innovation-hub.de',
  apiUrl: 'http://localhost:8081',
  features: {
    jobs: false,
    organizations: true,
    user: true,
    projects: true,
    partners: false
  }
};
