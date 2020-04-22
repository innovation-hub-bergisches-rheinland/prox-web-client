import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';

import { Project } from '@data/schema/project.resource';
import { Tag } from '@data/schema/tag.resource';
import { Module } from '@data/schema/module.resource';
import { ProjectService } from '@data/service/project.service';
import { ConfirmDialogComponent } from '@modules/project/components/confirm-dialog/confirm-dialog.component';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  projectID: string;
  hasPermission = false;

  project: Project;
  project$: Observable<Project>;

  projectTags$: Observable<Tag[]>;
  projectModules$: Observable<Module[]>;

  isTypeBA: boolean;
  isTypeMA: boolean;
  isTypePP: boolean;

  constructor(
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private location: Location
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      const userRoles = this.keycloakService.getUserRoles();
      this.hasPermission = userRoles.includes('professor');
    } else {
      this.hasPermission = false;
    }

    this.projectID = this.route.snapshot.paramMap.get('id');

    this.project$ = this.projectService.get(this.projectID);

    this.project$.subscribe(project => {
      this.project = project;

      this.projectModules$ = this.project.getModules();
      this.projectTags$ = this.project.getTags();

      this.containsProjectType('BA').subscribe(result => {
        this.isTypeBA = result;
      });
      this.containsProjectType('MA').subscribe(result => {
        this.isTypeMA = result;
      });
      this.containsProjectType('PP').subscribe(result => {
        this.isTypePP = result;
      });
    });
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.delete(project).subscribe(
          () => {},
          error => console.error('project service error', error),
          () => this.router.navigateByUrl('/projects')
        );
      }
    });
  }

  openProjectDialog(project: Project) {
    this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: project
    });
  }

  containsProjectType(search: string) {
    return this.project.getModules().pipe(
      map(modules => {
        return modules.filter(
          module => module.projectType.toLowerCase() === search.toLowerCase()
        );
      }),
      map(modules => (modules.length >= 1 ? true : false))
    );
  }

  goBack() {
    this.location.back();
  }
}
