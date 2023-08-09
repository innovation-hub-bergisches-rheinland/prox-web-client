import { Injectable } from '@angular/core';
import { ProjectSearchEntry } from '@data/schema/user.types';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';
import { Observable, catchError, from, map, mergeMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private userService: UserService, private keycloakService: KeycloakService) {}

  getProjectSearches(): Observable<ProjectSearchEntry[]> {
    return from(this.keycloakService.isLoggedIn()).pipe(
      mergeMap(isLoggedIn =>
        isLoggedIn
          ? this.userService.getCurrentAuthenticatedSearchHistory().pipe(
              map(searchHistory => searchHistory.projectSearches),
              catchError(() => of([]))
            )
          : of([])
      )
    );
  }
}
