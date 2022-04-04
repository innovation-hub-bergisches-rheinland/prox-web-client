import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { Organization } from '@data/schema/user-service.types';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationEditorDialogComponent } from '@modules/organization/components/organization-editor-dialog/organization-editor-dialog.component';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-organization-overview',
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class OrganizationOverviewComponent implements OnInit {
  organizations$: Observable<Organization[]>;
  canCreateNewOrg = false;

  constructor(private userService: UserService, private keycloakService: KeycloakService, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    this.refreshOrgs();
    this.canCreateNewOrg = await this.keycloakService.isLoggedIn();
  }

  openOrganizationEditor() {
    const dialog = this.dialog.open(OrganizationEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '80%',
      maxWidth: '80%'
    });
    dialog.afterClosed().subscribe({
      next: value => {
        if (value) {
          this.refreshOrgs();
        }
      }
    });
  }

  refreshOrgs() {
    this.organizations$ = this.userService.getAllOrganizations().pipe(map(orgs => orgs.sort((o1, o2) => o1.name.localeCompare(o2.name))));
  }
}
