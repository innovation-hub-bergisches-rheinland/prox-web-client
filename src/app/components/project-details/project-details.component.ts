import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../shared/hal-resources/project.resource';
import { ProjectService } from '../../core/services/project.service';
import { UUID } from 'angular2-uuid';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectEditorDialogComponent } from '../project-editor-dialog/project-editor-dialog.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { find, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Tag, Module } from '@prox/shared/hal-resources';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  projectID: UUID;
  hasPermission = false;

  project: Project;
  project$: Observable<Project>;

  projectTags$: Observable<Tag[]>;
  projectModules$: Observable<Module[]>;

  isTypeBA: boolean = false;
  isTypeMA: boolean = false;
  isTypePP: boolean = false;

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private user: KeyCloakUser,
    public dialog: MatDialog,
    private _location: Location
  ) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
    });
    this.route.params.subscribe(params => {
      this.projectID = params.id;
    });
  }

  ngOnInit() {
    this.project$ = this.projectService.get(this.projectID);

    this.project$.subscribe(project => {
      this.project = project;

      this.projectModules$ = this.project.getModules();
      this.projectTags$ = this.project.getTags();

      this.containsProjectType('BA').subscribe(result => (this.isTypeBA = result));
      this.containsProjectType('MA').subscribe(result => (this.isTypeMA = result));
      this.containsProjectType('PP').subscribe(result => (this.isTypePP = result));
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService
          .delete(project)
          .subscribe(
            () => {},
            error => console.log(error),
            () => this.router.navigateByUrl('/projects')
          );
      }
    });
  }

  openProjectDialog(project: Project) {
    const dialog = this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });
  }

  containsProjectType(search: string) {
    return this.project.getModules().pipe(
      map(modules => {
        console.log(modules);
        return modules.filter(module => module.projectType.toLowerCase() === search.toLowerCase());
      }),
      map(modules => (modules.length >= 1 ? true : false))
    );
  }

  goBack() {
    this._location.back();
  }
}
