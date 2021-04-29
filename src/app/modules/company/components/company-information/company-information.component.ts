import { HttpErrorResponse } from '@angular/common/http';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TextProcessor } from '@app/util/text-processor';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss'],
  host: { class: 'company-information' }
})
export class CompanyInformationComponent implements OnInit {
  @Input()
  company: Company;

  constructor(
    private companyProfileService: CompanyProfileService,
    public textProcessor: TextProcessor
  ) {}

  get logo(): string {
    return this.companyProfileService.getCompanyLogoUrl(this.company.id);
  }

  get branches(): string {
    return (
      [...this.company.branches].map(b => b.branchName).join(' / ') ?? null
    );
  }

  get quarters(): string {
    return [...this.company.quarters].map(q => q.location).join(', ') ?? null;
  }

  ngOnInit(): void {}
}
