import { Component, OnInit } from '@angular/core';
import { ProfileService } from '@data/service/profile.service';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationEditorDialogComponent } from '@modules/profile/modules/organization/components/organization-editor-dialog/organization-editor-dialog.component';
import { OrganizationList } from '@data/schema/profile.types';
import { PageEvent } from '@angular/material/paginator';
import { ProfileSearch } from '@modules/profile/components/profile-search-panel/profile-search-panel.component';

@Component({
  selector: 'app-organization-overview',
  templateUrl: './organization-overview.component.html',
  styleUrls: ['./organization-overview.component.scss']
})
export class OrganizationOverviewComponent implements OnInit {
  activeProfilePage$: Observable<OrganizationList>;
  canCreateNewOrg = false;

  constructor(private userService: ProfileService, private keycloakService: KeycloakService, private dialog: MatDialog) {}

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
    this.activeProfilePage$ = this.userService.getAllOrganizations();
  }

  handlePageEvent(event: PageEvent) {
    this.activeProfilePage$ = this.userService.getAllOrganizations({
      page: event.pageIndex,
      size: event.pageSize
    });
  }

  onSearch(event: ProfileSearch) {
    this.activeProfilePage$ = this.userService.filterOrganizations(event.txt, event.tags);
  }
}
