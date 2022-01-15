import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';
import { map } from 'rxjs';

type OrganizationMemberships = {
  name: string;
  isOwner: boolean;
};

@Component({
  selector: 'user-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.scss']
})
export class UserOrganizationsComponent implements OnInit {
  organizations: OrganizationMemberships[] = [];
  canCreateOrg: boolean = false;

  constructor(
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.canCreateOrg = this.keycloakService.isUserInRole(
        'organization_administrator',
        'prox-user-service'
      );

      this.userService
        .getOrganizationMembershipsOfAuthenticateduser()
        .pipe(
          map(memberships =>
            memberships.map(m => {
              return {
                name: m.organization.name,
                isOwner: m.type === 'OWNER'
              };
            })
          )
        )
        .subscribe({
          next: res => (this.organizations = res),
          error: err => console.error(err)
        });
    }

    // TODO else redirect to login page
  }
}
