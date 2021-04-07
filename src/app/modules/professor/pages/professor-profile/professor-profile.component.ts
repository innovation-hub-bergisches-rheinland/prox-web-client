import { HttpErrorResponse } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { ModuleType } from '@data/schema/openapi/project-service/models';
import { Project } from '@data/schema/project.resource';
import { Tag } from '@data/schema/tag.resource';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { KeycloakService } from 'keycloak-angular';
import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

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
  availableProjects$: Observable<Project[]>;
  projectHistory$: Observable<Project[]>;
  projectHistory: Project[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorProfileService,
    private projectService: ProjectService,
    private tagService: TagService,
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

  async ngOnInit() {
    this.activatedRoute.params.subscribe(res => (this.professorId = res['id']));
    this.professorService.getProfessorProfile(this.professorId).subscribe(
      res => {
        this.professor = res;
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
      this.availableProjects$ = this.projectService.findAvailableProjectsOfCreator(
        this.professorId
      );

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

      this.projectHistory$ = this.projectService.findRunningAndFinishedProjectsOfCreator(
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
