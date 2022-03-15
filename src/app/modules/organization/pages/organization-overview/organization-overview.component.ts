import { Component, OnInit } from '@angular/core';
import { UserService } from '@data/service/user.service';
import { Organization } from '@data/schema/user-service.types';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationEditorDialogComponent } from '@modules/organization/components/organization-editor-dialog/organization-editor-dialog.component';

@Component({
  selector: 'app-organization-overview',
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class OrganizationOverviewComponent implements OnInit {
  organizations$: Observable<Organization[]>;
  canCreateNewOrg: boolean = false;

  constructor(private userService: UserService, private keycloakService: KeycloakService, private dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    this.organizations$ = this.userService.getAllOrganizations();
    this.canCreateNewOrg = await this.keycloakService.isLoggedIn();
  }

  openOrganizationEditor() {
    const dialog = this.dialog.open(OrganizationEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '80%',
      maxWidth: '80%'
    });
  }
}
