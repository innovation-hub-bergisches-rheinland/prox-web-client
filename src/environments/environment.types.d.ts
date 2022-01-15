import { KeycloakConfig } from 'keycloak-js';

export interface Environment {
  production: boolean;
  keycloakConfig: KeycloakConfig;
  apiUrl: string;
  features: FeatureToggles;
}

// We use this little type as a feature toggle to flexibly en-- and disable
// features in Production and local environment.
// TODO: This can be further extended but we need a pragmatic approach at
//       the moment
type FeatureToggles = Record<string, boolean>;
