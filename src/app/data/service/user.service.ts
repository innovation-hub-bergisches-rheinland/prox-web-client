import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { AuthenticatedUserControllerService } from './openapi/user-service/authenticatedUserController.service';
import { GetOrganizationMembershipResponse } from '@data/schema/openapi/user-service/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    injector: Injector,
    private authenticatedUserService: AuthenticatedUserControllerService
  ) {}

  getOrganizationMembershipsOfAuthenticateduser(): Observable<
    GetOrganizationMembershipResponse[]
  > {
    return this.authenticatedUserService
      .getOrganizationMemberships()
      .pipe(map(memberships => Array.from(memberships)));
  }
}
