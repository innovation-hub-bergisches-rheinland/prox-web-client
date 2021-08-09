import { HttpErrorResponse } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Faculty,
  Professor
} from '@data/schema/openapi/professor-profile-service/models';
import { ModuleType } from '@data/schema/openapi/project-service/models';
import { Project } from '@data/schema/openapi/project-service/project';
import { Tag } from '@data/schema/tag.resource';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { ProfileBulletin } from '@modules/profile-page/components/common/profile-page-bulletin-list/profile-page-bulletin-list.component';
import { ProfilePageInformation } from '@modules/profile-page/components/common/profile-page-information/profile-page-information.component';
import { ProfileVita } from '@modules/profile-page/components/common/profile-page-vita/profile-page-vita.component';
import { KeycloakService } from 'keycloak-angular';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { JobOffer } from '@data/schema/openapi/job-service/jobOffer';
import { JobService } from '@data/service/job.service';

@Component({
  selector: 'app-professor-profile',
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.scss']
})
export class ProfessorProfileComponent implements OnInit {
  private professorId: string;
  private isLoggedIn: boolean;
  noContent: boolean = false;
  professor: Professor;
  faculty: Faculty;
  availableProjects$: Observable<Project[]>;
  jobOffers: JobOffer[];
  projectHistory$: Observable<Project[]>;
  projectHistory: Project[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorProfileService,
    private projectService: ProjectService,
    private tagService: TagService,
    private jobOfferService: JobService,
    private keycloakService: KeycloakService
  ) {}

  get hasPermission(): boolean {
    if (this.isLoggedIn) {
      let userId = this.keycloakService.getKeycloakInstance().subject;
      return (
        this.keycloakService.isUserInRole('professor') &&
        userId === this.professorId
      );
    }
    return false;
  }

  get professorInformation(): ProfilePageInformation {
    return {
      title: this.professor.name,
      subtitle: this.faculty?.name,
      imageUrl: this.professorService.getProfessorImageUrl(this.professor.id),
      properties: [
        {
          description: 'Hochschulzugehörigkeit seit',
          value: this.professor.affiliation
        },
        {
          description: 'Lehrgebiet',
          value: this.professor.mainSubject
        },
        {
          description: 'Standort, Raum',
          value: this.professor.contactInformation.room
        },
        {
          description: 'Sprechstunde',
          value: this.professor.contactInformation.consultationHour,
          urlProcessing: true
        },
        {
          description: 'Telefonnummer',
          value: this.professor.contactInformation.telephone,
          urlProcessing: true
        },
        {
          description: 'E-Mail',
          value: this.professor.contactInformation.email,
          urlProcessing: true
        },
        {
          description: 'Homepage',
          value: this.professor.contactInformation.homepage,
          urlProcessing: true
        },
        {
          description: 'Personalseite',
          value: this.professor.contactInformation.collegePage,
          urlProcessing: true
        }
      ]
    };
  }

  get professorVita(): ProfileVita {
    return {
      title: 'Werdegang',
      vita: this.professor.vita
    };
  }

  get professorResearchTopics(): ProfileBulletin {
    return {
      title: 'Forschungsgebiete',
      bulletins: this.professor.researchSubjects.map(r => r.subject)
    };
  }

  async ngOnInit() {
    this.activatedRoute.params.subscribe(res => (this.professorId = res['id']));
    this.professorService.getProfessorProfile(this.professorId).subscribe(
      res => {
        this.professor = res;
        this.professorService
          .getProfessorFaculty(this.professor.id)
          .subscribe(faculty => (this.faculty = faculty));
      },
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 404) {
            if (this.hasPermission) {
              this.editProfilePage();
              this.noContent = true;
            } else {
              this.router.navigate(['/404']);
            }
          } else {
            console.error('Unexpected error occurred');
          }
        } else {
          console.error('Unexpected error occured');
        }
      }
    );

    if (!this.noContent) {
      this.availableProjects$ =
        this.projectService.findAvailableProjectsOfCreator(this.professorId);

      this.jobOfferService.findAllJobsByCreator(this.professorId).subscribe({
        next: value => (this.jobOffers = value),
        error: error => console.error(error)
      });

      this.availableProjects$ = this.availableProjects$.pipe(
        mergeMap(projects => projects),
        mergeMap(project =>
          forkJoin({
            modules: this.projectService.getModulesOfProject(project)
          }).pipe(
            map((value: { modules: ModuleType[] }) => {
              project.modules = value.modules;
              return project;
            })
          )
        ),
        toArray()
      );

      this.projectHistory$ =
        this.projectService.findRunningAndFinishedProjectsOfCreator(
          this.professorId
        );

      this.projectHistory$.subscribe(
        res => (this.projectHistory = res),
        err => console.error(err)
      );

      if (await this.keycloakService.isLoggedIn()) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }
  }

  editProfilePage() {
    this.router.navigate(['edit'], { relativeTo: this.activatedRoute });
  }
}
