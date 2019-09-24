import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../shared/hal-resources/project.resource';
import { ProjectService } from '../../core/services/project.service';
import { UUID } from 'angular2-uuid';
import { KeyCloakUser } from '../../keycloak/KeyCloakUser';
import { MatConfirmDialogComponent } from '../../shared/mat-confirm-dialog/mat-confirm-dialog.component';
import { ProjectDialogComponent } from '../project-dialog/project-dialog.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
import { find, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;
  project$: Observable<Project>;
  projectID: UUID;
  hasPermission = false;

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
    const dialog = this.dialog.open(ProjectDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });
  }

  containsProjectType(project: Project, search: string) {
    return project.getModules().pipe(
      map(modules => modules.filter(module => module.projectType === search)),
      map(modules => (modules.length >= 1 ? true : false))
    );
  }

  goBack() {
    this._location.back();
  }
}
