import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureService } from '@data/service/feature.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanLoad {
  constructor(private featureService: FeatureService) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const featureName = route.data?.feature;
    // If the route does not have any feature, it is enabled
    if (!featureName) return true;

    return this.featureService.isFeatureEnabled(featureName);
  }
}
