import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { CompanyProfileService } from '@data/service/company-profile.service';

@Component({
  selector: 'app-companies-overview',
  templateUrl: './companies-overview.component.html',
  styleUrls: ['./companies-overview.component.scss']
})
export class CompanyOverviewComponent implements OnInit {
  _companies: Company[] = [];
  companyPage: Company[] = [];
  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  set companies(companies: Company[]) {
    this._companies = companies;
    companies.sort((a, b) =>
      a.information.name.localeCompare(b.information.name)
    );
  }

  get companies(): Company[] {
    return this._companies;
  }

  constructor(private companyProfileService: CompanyProfileService) {}

  ngOnInit(): void {
    this.companyProfileService
      .getAllCompanies()
      .subscribe(res => (this.companies = res));
  }

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageProfessors();
  }

  private pageProfessors() {
    this.setPageMetadata();
    this.companyPage = this.companies.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  setPageMetadata() {
    this.totalItems = this.companies.length;
    while (
      this.pageIndex > 0 &&
      this.pageSize * this.pageIndex >= this.totalItems
    ) {
      this.pageIndex -= 1;
    }
  }
}
