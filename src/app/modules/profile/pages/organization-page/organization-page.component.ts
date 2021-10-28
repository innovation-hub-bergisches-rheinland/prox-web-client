import { Component, OnInit } from '@angular/core';
import { map, mergeMap, tap, toArray } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import { Language } from '@data/schema/openapi/company-profile-service/language';
import { forkJoin, Observable, of } from 'rxjs';
import { environment } from '@env';
import { SocialMedia } from '@modules/profile/components/profile-avatar-card/profile-avatar-card.component';
import { FocusSubject } from '@modules/profile/components/profile-focus-areas/profile-focus-subjects.component';
import { ProjectService } from '@data/service/project.service';
import { AvailableProject } from '@modules/profile/components/profile-projects-card/profile-projects-card.component';
import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { AvailableJob } from '@modules/profile/components/profile-jobs-card/profile-jobs-card.component';
import { JobService } from '@data/service/job.service';
import { ProjectHistoryItem } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import {
  Profile,
  Sash
} from '@modules/profile/pages/profile-page/profile-page.component';
import { SliderImage } from '@modules/profile/components/profile-carousel/profile-carousel.component';

@Component({
  selector: 'app-organization-page',
  templateUrl: './organization-page.component.html',
  styleUrls: ['./organization-page.component.scss']
})
export class OrganizationPageComponent implements OnInit {
  private _company: Company;

  organizationProfile: Profile;
  organizationSash: Sash;
  sliderImages: SliderImage[];
  projects: Observable<AvailableProject[]>;
  jobs: Observable<AvailableJob[]>;
  projectHistory: Observable<ProjectHistoryItem[]>;

  get company(): Company {
    return this._company;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private companyProfileService: CompanyProfileService,
    private projectService: ProjectService,
    private jobService: JobService
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
          this.organizationProfile = {
            avatarUrl: `${environment.apiUrl}/companies/${this.company.id}/logo`,
            title: this._company.information.name,
            about: [
              {
                key: 'Anzahl Mitarbeiter',
                value: this._company.information.numberOfEmployees
              },
              {
                key: 'Gründungsjahr',
                value: this._company.information.foundingDate
              },
              {
                key: 'Hauptsitz',
                value: this._company.headquarter.location
              },
              {
                key: 'Weitere Standorte',
                value: this._company.quarters
                  .map(quarter => quarter.location)
                  .join(', ')
              },
              {
                key: 'Homepage',
                value: this._company.information.homepage,
                linkable: true
              },
              {
                key: 'E-Mail',
                value: this._company.information.contactEmail,
                linkable: true
              }
            ],
            languages: res.languages.map(lang => ({
              name: lang.germanName,
              isoIdentifier: lang.iso3166Mapping
            })),
            socialMedia: {
              facebook: this._company.socialMedia.find(
                sm => sm.type === 'FACEBOOK'
              )?.account,
              instagram: this._company.socialMedia.find(
                sm => sm.type === 'INSTAGRAM'
              )?.account,
              xing: this._company.socialMedia.find(sm => sm.type === 'XING')
                ?.account,
              twitter: this._company.socialMedia.find(
                sm => sm.type === 'TWITTER'
              )?.account,
              linkedIn: this._company.socialMedia.find(
                sm => sm.type === 'LINKEDIN'
              )?.account
            },
            focusSubjects: this._company.branches.map(b => {
              return {
                subject: b.branchName
              };
            })
          };
          if (this._company.information.vita) {
            this.organizationSash = {
              title: 'Beschreibung',
              text: this._company.information.vita
            };
          }
          this.sliderImages = [
            {
              path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab'
            },
            {
              path: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8'
            },
            {
              path: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625'
            }
          ];
          this.projects = this.projectService
            .findAvailableProjectsOfCreator(this._company.creatorId)
            .pipe(
              mergeMap(projects => projects),
              mergeMap(project =>
                forkJoin({
                  modules: this.projectService.getModulesOfProject(project)
                }).pipe(
                  map((value: { modules: ModuleType[] }) => {
                    return {
                      id: project.id,
                      name: project.name,
                      modules: value.modules.map(m => m.name)
                    };
                  })
                )
              ),
              toArray()
            );
          this.jobs = this.jobService
            .findAllJobsByCreator(this._company.creatorId)
            .pipe(
              mergeMap(jobs => jobs),
              mergeMap(job =>
                forkJoin({
                  job: of(job),
                  levels: this.jobService.getEntryLevelsFromJobOffer(job.id)
                }).pipe(
                  map(jobs => {
                    return {
                      id: jobs.job.id,
                      name: jobs.job.title,
                      levels: jobs.levels.map(lvl => lvl.description)
                    };
                  })
                )
              ),
              toArray()
            );
          this.projectHistory = this.projectService
            .findRunningAndFinishedProjectsOfCreator(this._company.creatorId)
            .pipe(
              map(projects =>
                projects.map(project => {
                  return {
                    id: project.id,
                    title: project.name,
                    supervisor: project.supervisorName,
                    description: project.shortDescription
                  };
                })
              )
            );
        },
        error: err => {
          console.error(err);
        }
      });
  }
}
