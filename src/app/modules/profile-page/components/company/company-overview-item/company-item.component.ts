import { Component, Input, OnInit } from '@angular/core';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import {
  EntityModelProfessorOverviewDto,
  Professor,
  ProfessorOverviewDto
} from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.scss'],
  host: { '[class.company-item-wrapper]': 'true' }
})
export class CompanyItemComponent implements OnInit {
  @Input()
  company: Company;

  constructor(public companyService: CompanyProfileService) {}

  ngOnInit() {}

  getProfilePictureUrl(company: Company): string {
    return this.companyService.getCompanyLogoUrl(company.id);
  }

  getBranches(): string[] {
    return [...this.company.branches].map(b => b.branchName);
  }
}
