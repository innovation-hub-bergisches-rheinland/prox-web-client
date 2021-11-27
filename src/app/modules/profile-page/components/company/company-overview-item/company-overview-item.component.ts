import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { CompanyProfileService } from '@data/service/company-profile.service';

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
  `
})
export class CompanyItemComponent {
  @HostBinding('[class.company-item.wrapper]')
  wrapper = true;

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
    return `./companies/${this.company.id}`;
  }

  constructor(public companyService: CompanyProfileService) {}
}
