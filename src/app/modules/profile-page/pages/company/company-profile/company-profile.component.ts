import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { Language } from '@data/schema/openapi/company-profile-service/language';
import { SocialMedia } from '@data/schema/openapi/company-profile-service/socialMedia';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { ProfileBulletin } from '@modules/profile-page/components/common/profile-page-bulletin-list/profile-page-bulletin-list.component';
import { ProfilePageInformation } from '@modules/profile-page/components/common/profile-page-information/profile-page-information.component';
import { ProfileVita } from '@modules/profile-page/components/common/profile-page-vita/profile-page-vita.component';
import { KeycloakService } from 'keycloak-angular';
import { info } from 'node:console';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
  host: { class: 'company-profile' }
})
export class CompanyProfileComponent implements OnInit {
  company: Company;
  languages: Language[] = [];
  socialMedia: SocialMedia[] = [];
  hasPermission: boolean;
  isMe: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private companyProfileService: CompanyProfileService,
    private keycloakService: KeycloakService
  ) {}

  get companyInformation(): ProfilePageInformation {
    const information: ProfilePageInformation = {
      title: this.company.information.name,
      imageUrl: this.companyProfileService.getCompanyLogoUrl(this.company.id),
      properties: [
        {
          description: 'Gründungsjahr',
          value: this.company.information.foundingDate
        },
        {
          description: 'Mitarbeiteranzahl',
          value: this.company.information.numberOfEmployees
        },
        {
          description: 'Hauptsitz',
          value: this.company.headquarter.location
        },
        {
          description: 'Weitere Standorte',
          value: [...this.company.quarters].map(q => q.location).join(', ')
        },
        {
          description: 'Homepage',
          value: this.company.information.homepage,
          urlProcessing: true
        }
      ]
    };

    return information;
  }

  get companyBranches(): ProfileBulletin {
    return {
      title: 'Branchen',
      bulletins: [...this.company.branches].map(b => b.branchName)
    };
  }

  get companyVita(): ProfileVita {
    return {
      title: 'Unternehmensbeschreibung',
      vita: this.company.information.vita
    };
  }

  get companyLanguages(): ProfileBulletin {
    return {
      title: 'Sprachen im Unternehmen',
      bulletins: [...this.languages].map(l => l.germanName)
    };
  }

  async ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map(route => route['id']),
        mergeMap(id => {
          if (id === 'me') {
            this.isMe = true;
            return this.companyProfileService.getMyCompany();
          }
          return this.companyProfileService.getCompanyById(id);
        })
      )
      .subscribe(
        res => {
          this.company = res;
          this.socialMedia = this.company.socialMedia ?? [];

          this.companyProfileService
            .getCompanyLanguages(this.company.id)
            .subscribe(res => (this.languages = res));

          if (this.isMe) {
            this.router.navigate(['/companies', this.company.id]);
          }

          this.keycloakService.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
              let userId = this.keycloakService.getKeycloakInstance().subject;
              this.hasPermission =
                this.keycloakService.isUserInRole('company-manager') &&
                userId === this.company.creatorId;
            }
          });
        },
        err => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 404) {
              if (!this.isMe) {
                this.router.navigate(['/404']);
              } else {
                this.keycloakService.isLoggedIn().then(isLoggedIn => {
                  if (isLoggedIn) {
                    this.hasPermission =
                      this.keycloakService.isUserInRole('company-manager') &&
                      this.isMe;

                    if (this.hasPermission) {
                      this.router.navigate(['edit'], {
                        relativeTo: this.activatedRoute
                      });
                    } else {
                      this.router.navigate(['/404']);
                    }
                  } else {
                    this.router.navigate(['/404']);
                  }
                });
              }
            } else {
              console.error(err);
            }
          } else {
            console.error(err);
          }
        }
      );
  }

  editProfilePage() {
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
}
