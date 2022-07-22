import { Injectable } from '@angular/core';
import { FeatureConfig } from '@app/feature.types';
import { environment } from '@env';

const ALL_FEATURES = 'ALL';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  config: FeatureConfig = environment.enabledFeatures ?? [];

  isEnabled(name: string): boolean {
    return this.config.includes(ALL_FEATURES) || this.config[name];
  }

  set(config: FeatureConfig): void {
    if (environment.enabledFeatures) {
      this.config = [...environment.enabledFeatures, ...config];
    } else {
      this.config = config;
    }
  }
}
