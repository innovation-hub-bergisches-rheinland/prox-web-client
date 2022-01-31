import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, concat, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Tag } from '@data/schema/tag.resource';
import { Module } from '@data/schema/module.resource';
import { ProjectService } from '@data/service/project.service';
import Autolinker from 'autolinker';
import { TagService } from '@data/service/tag.service';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { Professor } from '@data/schema/openapi/professor-profile-service/professor';
import { CompanyProfileService } from '@data/service/company-profile.service';
import { ModuleType, Project, ProjectWithModules } from '@data/schema/project-service.types';
import { KeycloakService } from 'keycloak-angular';
import { ProjectEditorDialogComponent } from '@modules/project/components/project-editor-dialog/project-editor-dialog.component';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnChanges {
  @Input()
  project: Project;

  projectTags$: Observable<Tag[]>;
  projectModules$: Observable<ModuleType[]>;

  @Input()
  showDetails = false;

  @Output()
  updated: EventEmitter<Project> = new EventEmitter<Project>();

  @Output()
  deleted: EventEmitter<void> = new EventEmitter<void>();

  hasPermission = false;

  constructor(
    private keycloakService: KeycloakService,
    private tagService: TagService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    const project: Project = changes['project'].currentValue;
    if (project) {
      this.hasPermission =
        (await this.keycloakService.isLoggedIn()) && this.keycloakService.getKeycloakInstance().subject === this.project.creatorID;
      this.projectTags$ = this.tagService.getAllTagsOfProject(this.project.id);
      this.projectModules$ = this.projectService.getModulesOfProject(this.project);
    }
  }

  editProject() {
    const dialog = this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: this.project
    });

    dialog.afterClosed().subscribe({
      next: (updatedProject: Project) => {
        if (updatedProject) {
          this.updated.emit(updatedProject);
        }
      }
    });
  }

  deleteProject() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Löschen', message: 'Projekt wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(this.project).subscribe(
          () => {
            this.deleted.emit();
          },
          error => {
            this.toastService.showToast({
              message: 'Projekt konnte nicht gelöscht werden, versuchen Sie es bitte später erneut.',
              isError: true
            });
          }
        );
      }
    });
  }
}
