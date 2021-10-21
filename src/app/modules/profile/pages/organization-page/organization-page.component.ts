import { Component, OnInit } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { Language } from '@data/schema/openapi/company-profile-service/language';
import { Observable } from 'rxjs';
import { environment } from '@env';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss']
})
export class OrganizationPageComponent implements OnInit {
  private _company: Company;
  private _languages: Language[];
  logo: string;

  get company(): Company {
    return this._company;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyProfileService: CompanyProfileService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(route => route.id),
        mergeMap(id => {
          return this.companyProfileService.getCompanyById(id);
        })
      )
      .subscribe({
        next: res => {
          this._company = res;
          this.logo = `${environment.apiUrl}/companies/${res.id}/logo`;
          this.companyProfileService
            .getCompanyLanguages(this._company.id)
            .subscribe(langs => {
              this._languages = langs;
            });
        },
        error: err => {
          console.error(err);
        }
      });
  }
}
