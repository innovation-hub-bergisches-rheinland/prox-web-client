import { KeycloakConfig } from 'keycloak-js';

export interface Environment {
  production: boolean;
  keycloakConfig: KeycloakConfig;
  apiUrl: string;
  enabledFeatures?: string[];
}
