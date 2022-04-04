import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';

import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard {
  constructor(protected router: Router, protected keycloakAngular: KeycloakService) {
    super(router, keycloakAngular);
  }

  // eslint-disable-next-line no-unused-vars
  async isAccessAllowed(route, state: RouterStateSnapshot): Promise<boolean> {
    if (!this.authenticated) {
      await this.keycloakAngular.login();
      return;
    }

    const requiredRoles = route.data.roles;
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    } else {
      if (!this.roles || this.roles.length === 0) {
        return false;
      }
      let granted = false;
      for (const requiredRole of requiredRoles) {
        if (this.roles.indexOf(requiredRole) > -1) {
          granted = true;
          break;
        }
      }
      return granted;
    }
  }
}
