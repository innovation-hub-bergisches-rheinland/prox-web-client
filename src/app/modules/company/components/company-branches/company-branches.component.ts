import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Branch } from '@data/schema/openapi/company-profile-service/branch';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import {
  Professor,
  ResearchSubject
} from '@data/schema/openapi/professor-profile-service/models';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-company-branches',
  templateUrl: './company-branches.component.html',
  styleUrls: ['./company-branches.component.scss'],
  host: { class: 'company-branches' }
})
export class CompanyBranchesComponent implements OnInit {
  @Input()
  company: Company;
  branches: Branch[] = [];

  constructor() {}

  ngOnInit(): void {
    this.branches = [...this.company.branches].sort((a, b) =>
      a.branchName.localeCompare(b.branchName)
    );
  }
}
