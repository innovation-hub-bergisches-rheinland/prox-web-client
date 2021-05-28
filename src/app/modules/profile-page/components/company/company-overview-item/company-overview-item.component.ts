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
  selector: 'app-company-overview-item',
  template: `
    <app-profile-overview-card
      [title]="companyName"
      [href]="profileLink"
      [chipTitle]="'Branchen'"
      [imgSrc]="logoUrl"
      [chips]="branches"
    ></app-profile-overview-card>
  `,
  host: { '[class.company-item-wrapper]': 'true' }
})
export class CompanyItemComponent implements OnInit {
  @Input()
  company: Company;

  get companyName(): string {
    return this.company.information.name;
  }

  get logoUrl(): string {
    return this.companyService.getCompanyLogoUrl(this.company.id);
  }

  get branches(): string[] {
    return [...this.company.branches].map(b => b.branchName);
  }

  get profileLink(): string {
    return `./lecturers/${this.company.id}`;
  }

  constructor(public companyService: CompanyProfileService) {}

  ngOnInit() {}
}
