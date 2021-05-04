import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
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
import { TextProcessor } from '@app/util/text-processor';
import { TagService } from '@data/service/tag.service';
import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { ProfessorProfileService } from '@data/service/professor-profile.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  projectID: string;
  hasPermission = false;

  project: Project;

  projectTags$: Observable<Tag[]>;
  projectModules: ModuleType[];
  projectSupervisors: string[] = [];

  constructor(
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private location: Location,
    public textProcessor: TextProcessor,
    private professorService: ProfessorProfileService
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      const userRoles = this.keycloakService.getUserRoles();
      this.hasPermission = userRoles.includes('professor');
    } else {
      this.hasPermission = false;
    }

    this.projectID = this.route.snapshot.paramMap.get('id');

    this.getProject();
  }

  private loadSupervisorLinks() {
    //Split supervisors and collect them
    const splitChars = /,|;|\//g;
    this.projectSupervisors = this.project.supervisorName
      .split(splitChars)
      .map(s => s.trim())
      .filter(s => s.length >= 0);

    this.professorService
      .findProfessorWithNameLike(this.projectSupervisors)
      .subscribe(res => {
        this.projectSupervisors = [];
        for (const [key, value] of Object.entries(res)) {
          if (value == null) {
            this.projectSupervisors.push(key);
          } else {
            this.projectSupervisors.push(
              `<a href="/lecturers/${value}">${key}</a>`
            );
          }
        }
      });
  }

  getProjectSupervisors() {
    return this.projectSupervisors.join(',');
  }

  public hasProjectPermission(project: Project): boolean {
    let userId = this.keycloakService.getKeycloakInstance().subject;
    return this.hasPermission && userId === project.creatorID;
  }

  deleteProject(project: Project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(project).subscribe(
          () => {},
          error => console.error('project service error', error),
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

    dialog.afterClosed().subscribe(() => this.getProject());
  }

  goBack() {
    this.location.back();
  }

  getProject() {
    this.projectService.getProject(this.projectID).subscribe(project => {
      this.project = project;

      this.projectService.getModulesOfProject(project).subscribe(
        res => (this.projectModules = res),
        err => console.error(err)
      );
      this.projectTags$ = this.tagService.getAllTagsOfProject(project.id);
      this.loadSupervisorLinks();
    });
  }
}
