import { KeycloakConfig } from 'keycloak-js';

export interface Environment {
  production: boolean;
  name: string;
  keycloakConfig: KeycloakConfig;
  apiUrl: string;
  enabledFeatures?: string[];
  loggingConfig: LoggingConfig;
}

export interface LoggingConfig {
  error: boolean;
  warn: boolean;
  info: boolean;
  debug: boolean;
}
