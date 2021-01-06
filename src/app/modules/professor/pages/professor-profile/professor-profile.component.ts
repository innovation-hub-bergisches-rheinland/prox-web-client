import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Project } from '@data/schema/project.resource';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';

@Component({
  selector: 'app-professor-profile',
  templateUrl: './professor-profile.component.html',
  styleUrls: ['./professor-profile.component.scss']
})
export class ProfessorProfileComponent implements OnInit {
  private professorId: string;
  professor$: Observable<Professor>;
  availableProjects$: Observable<Project[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private professorService: ProfessorProfileService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => (this.professorId = res['id']));
    this.professor$ = this.professorService.getProfessorProfile(
      this.professorId
    );
    this.professor$.subscribe(
      _ => {},
      err => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 404) {
            this.router.navigate(['/404']);
          } else {
            console.error('Unexpected error occurred');
          }
        } else {
          console.error('Unexpected error occured');
        }
      }
    );

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
  }
}
