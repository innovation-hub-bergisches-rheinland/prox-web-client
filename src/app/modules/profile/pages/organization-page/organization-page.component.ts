import { Component, OnInit } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { Language } from '@data/schema/openapi/company-profile-service/language';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '@env';
import { SocialMedia } from '@modules/profile/components/profile-avatar-card/profile-avatar-card.component';
import { FocusSubject } from '@modules/profile/components/profile-focus-areas/profile-focus-subjects.component';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss']
})
export class OrganizationPageComponent implements OnInit {
  private _company: Company;
  private _languages: Language[];
  logo: string;
  socialMedia: SocialMedia;
  focusSubjects: FocusSubject[];
  languages: Language[];

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
          return forkJoin({
            company: this.companyProfileService.getCompanyById(id),
            languages: this.companyProfileService.getCompanyLanguages(id)
          });
        })
      )
      .subscribe({
        next: res => {
          this._company = res.company;
          this.logo = `${environment.apiUrl}/companies/${this._company.id}/logo`;
          this.companyProfileService
            .getCompanyLanguages(this._company.id)
            .subscribe(langs => {
              this._languages = langs;
            });
          this.socialMedia = {
            facebook: this._company.socialMedia.find(
              sm => sm.type === 'FACEBOOK'
            )?.account,
            instagram: this._company.socialMedia.find(
              sm => sm.type === 'INSTAGRAM'
            )?.account,
            xing: this._company.socialMedia.find(sm => sm.type === 'XING')
              ?.account,
            twitter: this._company.socialMedia.find(sm => sm.type === 'TWITTER')
              ?.account,
            linkedIn: this._company.socialMedia.find(
              sm => sm.type === 'LINKEDIN'
            )?.account
          };
          this.focusSubjects = this._company.branches.map(b => {
            return {
              subject: b.branchName
            };
          });
          this.languages = res.languages;
        },
        error: err => {
          console.error(err);
        }
      });
  }
}
