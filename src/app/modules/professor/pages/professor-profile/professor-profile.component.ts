import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
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
  professor$: Observable<Professor>;
  availableProjects$: Observable<Project[]>;
  projectHistory$: Observable<Project[]>;
  projectHistory: Project[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorProfileService,
    private projectService: ProjectService,
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
    this.professor$ = this.professorService.getProfessorProfile(
      this.professorId
    );
    this.professor$.subscribe(
      _ => {},
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 404) {
            if (this.hasPermission) {
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
      this.availableProjects$ = this.professor$.pipe(
        mergeMap(prof =>
          this.projectService.findAvailableProjectsOfCreator(prof.id)
        )
      );

      this.availableProjects$ = this.availableProjects$.pipe(
        mergeMap(projects => projects),
        mergeMap(project =>
          this.projectService.getModulesOfProject(project).pipe(
            map(modules => {
              project.modules = modules;
              return project;
            })
          )
        ),
        toArray()
      );

      this.projectHistory$ = this.professor$.pipe(
        mergeMap(prof =>
          this.projectService.findRunningAndFinishedProjectsOfCreator(prof.id)
        )
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

  editProfilePage() {}
}
