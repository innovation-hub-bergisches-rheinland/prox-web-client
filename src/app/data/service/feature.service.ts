import { Injectable } from '@angular/core';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  isFeatureEnabled(featureName: string): boolean {
    // Features are disabled by default
    return environment.features[featureName] ?? false;
  }
}
