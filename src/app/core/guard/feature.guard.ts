import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FeatureService } from '@app/service/feature.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanLoad {
  constructor(private featureService: FeatureService, private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const featureName = route.data?.feature;
    // If the route does not have any feature, it is enabled
    if (!featureName) return true;

    const hasFeature = this.featureService.isEnabled(featureName);
    if (hasFeature) return true;

    this.router.navigate(['/']);
    return false;
  }
}
