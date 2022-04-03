import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProjectHistoryItem } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@data/service/project.service';
import { JobService } from '@data/service/job.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Professor } from '@data/schema/openapi/professor-profile-service/professor';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { KeycloakService } from 'keycloak-angular';
import { ToastService } from '@modules/toast/toast.service';
import { Faculty } from '@data/schema/openapi/professor-profile-service/faculty';
import { ProjectWithAssociations } from '@data/schema/project-service.types';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';

@Component({
  selector: 'app-lecturer-page',
  templateUrl: './lecturer-page.component.html',
  styleUrls: ['./lecturer-page.component.scss']
})
export class LecturerPageComponent implements OnInit {
  lecturer$: Observable<Professor>;
  faculty$: Observable<Pick<Faculty, 'name'>>;
  projects$: Observable<ProjectWithAssociations[]>;
  jobs$: Observable<JobOffer[]>;
  projectHistory$: Observable<ProjectHistoryItem[]>;
  publications$: Observable<string[]>;
  avatar$: Observable<string>;
  hasPermission = false;
  faBullseye = faBullseye;

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
              this.hasPermission = this.keycloakService.isUserInRole('professor') && userId === id;
            }
          });
        })
      )
      .subscribe({
        next: id => {
          this.lecturer$ = this.professorService.getProfessorProfile(id).pipe(
            catchError(async err => {
              // TODO: this really needs to be refactored... As the whole component
              if (err.status === 404) {
                this.toastService.showToast(
                  {
                    message: 'Ihr Profil existiert noch nicht - Sie können jetzt eins erstellen'
                  },
                  5000
                );
                await this.router.navigate(['edit'], {
                  relativeTo: this.activatedRoute
                });
              }
              throw err;
            })
          );
          this.publications$ = this.lecturer$.pipe(map(l => l.publications.map(p => p.publication)));
          this.avatar$ = of(this.professorService.getProfessorImageUrl(id));
          this.faculty$ = this.professorService.getProfessorFaculty(id).pipe(catchError(() => of({ name: '' })));

          this.projects$ = this.projectService.findAvailableProjectsOfCreator(id, 'withAssociations').pipe(catchError(err => []));
          this.jobs$ = this.jobService.findAllJobsByCreator(id).pipe(catchError(err => []));
          this.projectHistory$ = this.projectService.findRunningAndFinishedProjectsOfCreator(id).pipe(
            map(projects =>
              projects.map(project => {
                return {
                  id: project.id,
                  title: project.name,
                  supervisor: project.supervisorName,
                  description: project.shortDescription
                };
              })
            ),
            catchError(err => [])
          );
        }
      });
  }
}
