// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { KeycloakConfig } from 'keycloak-js';

const keycloakConfig: KeycloakConfig = {
  url: 'https://login.archi-lab.io/auth',
  realm: 'archilab',
  clientId: 'prox-web-client'
};

export const environment = {
  production: false,
  keycloakConfig,
  apiUrl: 'https://api.dev.prox.innovation-hub.de'
};
