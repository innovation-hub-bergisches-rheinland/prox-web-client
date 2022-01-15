import { Injectable, Injector } from '@angular/core';

import { Observable, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CompanyAPIService } from './openapi/company-profile-service/companyAPI.service';
import { LanguageAPIService } from './openapi/company-profile-service/languageAPI.service';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { environment } from '@env';
import { Language } from '@data/schema/openapi/company-profile-service/language';

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

  getMyCompany(): Observable<Company> {
    return this.companyApiService.getMyCompany('body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  getCompanyLogoUrl(id: string): string {
    return `${environment.apiUrl}/companies/${id}/logo`;
  }

  getCompanyProfileUrl(id: string): string {
    return `/orgs/${id}`;
  }

  getAllCompanies(): Observable<Company[]> {
    return this.companyApiService
      .getAllCompanies('body', false, {
        httpHeaderAccept: 'application/hal+json'
      })
      .pipe(map(c => c._embedded.companyList));
  }

  getAllLanguages(): Observable<Language[]> {
    return this.languageApiService
      .getAllLanguages(['LIVING'], 'body', false, {
        httpHeaderAccept: 'application/hal+json'
      })
      .pipe(map(c => c._embedded.languageList));
  }

  updateCompanyProfile(id: string, company: Company): Observable<Company> {
    return this.companyApiService.updateCompany(id, company, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  saveCompanyProfile(company: Company): Observable<Company> {
    return this.companyApiService.saveCompany(company, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }

  saveCompanyLogo(id: string, image: Blob): Observable<any> {
    return this.companyApiService.postCompanyLogo(id, image);
  }

  deleteCompanyLogo(id: string): Observable<any> {
    return this.companyApiService.deleteCompanyLogo(id);
  }

  saveCompanyLanguages(id: string, languages: Language[]): Observable<any> {
    return this.companyApiService.putCompanyLanguages(
      id,
      languages.map(l => l.id),
      'body',
      false,
      {
        httpHeaderAccept: 'application/hal+json'
      }
    );
  }

  getCompanyLanguages(id: string): Observable<Language[]> {
    return this.companyApiService
      .getCompanyLanguages(id, 'body', false, {
        httpHeaderAccept: 'application/hal+json'
      })
      .pipe(map(l => l._embedded?.languageList ?? []));
  }

  findCompanyByCreatorId(id: string): Observable<Company> {
    return this.companyApiService.findCompanyByCreatorId(id, 'body', false, {
      httpHeaderAccept: 'application/hal+json'
    });
  }
}
