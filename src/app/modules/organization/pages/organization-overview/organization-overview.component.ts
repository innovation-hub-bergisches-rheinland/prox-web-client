import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { Organization } from '@data/schema/user-service.types';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-organization-overview',
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class OrganizationOverviewComponent implements OnInit {
  organizations$: Observable<Organization[]>;
  canCreateNewOrg: boolean = false;

  constructor(private userService: UserService, private keycloakService: KeycloakService) {}

  async ngOnInit(): Promise<void> {
    this.organizations$ = this.userService.getAllOrganizations();
    this.canCreateNewOrg = await this.keycloakService.isLoggedIn();
  }
}
