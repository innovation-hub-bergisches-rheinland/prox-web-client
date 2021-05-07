import { Injectable, Injector } from '@angular/core';

import { Observable, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CompanyAPIService } from './openapi/company-profile-service/companyAPI.service';
import { LanguageAPIService } from './openapi/company-profile-service/languageAPI.service';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { environment } from '@env';

@Injectable({
  providedIn: 'root'
})
export class CompanyProfileService {
  constructor(
    injector: Injector,
    private companyApiService: CompanyAPIService,
    private languageApiService: LanguageAPIService,
    private httpClient: HttpClient
  ) {}

  getCompanyById(id: string): Observable<Company> {
    return this.companyApiService.getCompany(id, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  getCompanyLogoUrl(id: string): string {
    return `${environment.apiUrl}/companies/${id}/logo`;
  }
}
