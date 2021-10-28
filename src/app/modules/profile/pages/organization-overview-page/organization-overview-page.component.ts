import { Component, OnInit } from '@angular/core';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { OverviewItem } from '@modules/profile/pages/overview-page/overview-page.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { environment } from '@env';

@Component({
  selector: 'app-organization-overview-page',
  templateUrl: './organization-overview-page.component.html',
  styleUrls: ['./organization-overview-page.component.scss']
})
export class OrganizationOverviewPageComponent implements OnInit {
  organizations: Observable<OverviewItem[]>;

  constructor(private organizationService: CompanyProfileService) {}

  ngOnInit(): void {
    this.organizations = this.organizationService.getAllCompanies().pipe(
      map(items =>
        items.map(item => ({
          avatar: `${environment.apiUrl}/companies/${item.id}/logo`,
          title: item.information.name,
          numAvailableProjects: 0,
          numFinishedProjects: 0,
          numRunningProjects: 0,
          href: `/profile/orgs/${item.id}`
        }))
      )
    );
  }
}
