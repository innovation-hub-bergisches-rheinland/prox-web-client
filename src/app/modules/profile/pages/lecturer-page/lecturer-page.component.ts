import { Component, OnInit } from '@angular/core';
import { Company } from '@data/schema/openapi/company-profile-service/company';
import {
  Profile,
  Sash
} from '@modules/profile/pages/profile-page/profile-page.component';
import { forkJoin, Observable, of } from 'rxjs';
import { AvailableProject } from '@modules/profile/components/profile-projects-card/profile-projects-card.component';
import { AvailableJob } from '@modules/profile/components/profile-jobs-card/profile-jobs-card.component';
import { ProjectHistoryItem } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@data/service/project.service';
import { JobService } from '@data/service/job.service';
import { catchError, map, mergeMap, tap, toArray } from 'rxjs/operators';
import { Professor } from '@data/schema/openapi/professor-profile-service/professor';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { Publication } from '@modules/profile/components/profile-publications-card/profile-publications-card.component';
import { KeycloakService } from 'keycloak-angular';
import { ToastService } from '@modules/toast/toast.service';
import { EntityModelFaculty } from '@data/schema/openapi/professor-profile-service/entityModelFaculty';

interface ModuleType {
  key: string;
  name: string;
}

@Component({
  selector: 'app-lecturer-page',
  templateUrl: './lecturer-page.component.html',
  styleUrls: ['./lecturer-page.component.scss']
})
export class LecturerPageComponent implements OnInit {
  private _lecturer: Professor;

  lecturerProfile: Profile;
  lecturerSash: Sash;
  projects: Observable<AvailableProject[]>;
  jobs: Observable<AvailableJob[]>;
  projectHistory: Observable<ProjectHistoryItem[]>;
  publications: Observable<Publication[]>;
  hasPermission: boolean;

  get lecturer(): Professor {
    return this._lecturer;
  }

  constructor(
    private keycloakService: KeycloakService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorProfileService,
    private projectService: ProjectService,
    private jobService: JobService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map(route => route.id),
        tap(id => {
          this.keycloakService.isLoggedIn().then(isLoggedIn => {
            if (isLoggedIn) {
              const userId = this.keycloakService.getKeycloakInstance().subject;
              this.hasPermission =
                this.keycloakService.isUserInRole('professor') && userId === id;
            }
          });
        }),
        mergeMap(id => {
          return forkJoin({
            lecturer: this.professorService.getProfessorProfile(id),
            faculty: this.professorService.getProfessorFaculty(id).pipe(
              catchError(() => {
                return of({
                  name: ''
                });
              })
            )
          });
        })
      )
      .subscribe({
        next: res => {
          this._lecturer = res.lecturer;
          this.lecturerProfile = {
            avatarUrl: this.professorService.getProfessorImageUrl(
              this._lecturer.id
            ),
            title: this._lecturer.name,
            subtitle: res.faculty.name,
            about: [
              {
                key: 'Hochschulzugehörigkeit seit',
                value: this._lecturer.affiliation
              },
              {
                key: 'Lehrgebiet',
                value: this._lecturer.mainSubject
              },
              {
                key: 'Standort, Raum',
                value: this._lecturer.contactInformation.room
              },
              {
                key: 'Sprechstunde',
                value: this._lecturer.contactInformation.consultationHour,
                linkable: true
              },
              {
                key: 'Telefonnummer',
                value: this._lecturer.contactInformation.telephone,
                linkable: true
              },
              {
                key: 'E-Mail',
                value: this._lecturer.contactInformation.email,
                linkable: true
              },
              {
                key: 'Homepage',
                value: this._lecturer.contactInformation.homepage,
                linkable: true
              },
              {
                key: 'Personalseite',
                value: this._lecturer.contactInformation.collegePage,
                linkable: true
              }
            ],
            languages: undefined,
            socialMedia: undefined,
            focusSubjects: this._lecturer.researchSubjects.map(s => {
              return {
                subject: s.subject
              };
            })
          };
          if (this._lecturer.vita) {
            this.lecturerSash = {
              title: 'Werdegang',
              text: this._lecturer.vita
            };
          }
          this.projects = this.projectService
            .findAvailableProjectsOfCreator(this._lecturer.id)
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
                      modules: value.modules.map(m => m.key)
                    };
                  })
                )
              ),
              toArray()
            );
          this.jobs = this.jobService
            .findAllJobsByCreator(this._lecturer.id)
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
            .findRunningAndFinishedProjectsOfCreator(this._lecturer.id)
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
          this.publications = of(this._lecturer.publications).pipe(
            map(pubs => pubs.map(pub => ({ publication: pub.publication })))
          );
        },
        error: async err => {
          // TODO: this really needs to be refactored... As the whole component
          if (err.status === 404) {
            this.toastService.showToast(
              {
                message:
                  'Ihr Profil existiert noch nicht - Sie können jetzt eins erstellen'
              },
              5000
            );
            await this.router.navigate(['edit'], {
              relativeTo: this.activatedRoute
            });
          }
          console.error(err);
        }
      });
  }
}
