import { Component, OnInit } from '@angular/core';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { OverviewItem } from '@modules/profile/pages/overview-page/overview-page.component';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { environment } from '@env';
import { KeycloakService } from 'keycloak-angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-organization-overview-page',
  templateUrl: './organization-overview-page.component.html',
  styleUrls: ['./organization-overview-page.component.scss']
})
export class OrganizationOverviewPageComponent implements OnInit {
  organizations: Observable<OverviewItem[]>;
  hasOrganizationCreatePermission$: Observable<boolean>;

  constructor(
    private organizationService: CompanyProfileService,
    private keycloakService: KeycloakService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.organizations = this.organizationService.getAllCompanies().pipe(
      map(items =>
        items.map(item => ({
          avatar: `${environment.apiUrl}/companies/${item.id}/logo`,
          title: item.information.name,
          numAvailableProjects: 0,
          numFinishedProjects: 0,
          numRunningProjects: 0,
          href: `/orgs/${item.id}`
        }))
      )
    );
    this.hasOrganizationCreatePermission$ = this.organizationService.getMyCompany().pipe(
      map(res => {
        // If there's an organisation - the user should not be able to create a new one
        return false;
      }),
      catchError(err => {
        // The user should only be able to create a new org IF and only IF there's no org present
        // associated with him which will result in a 404 error
        return of(err.status === 404 || false);
      })
    );
  }

  async redirectToOrgEditor() {
    await this.router.navigate(['new'], { relativeTo: this.activatedRoute });
  }
}
