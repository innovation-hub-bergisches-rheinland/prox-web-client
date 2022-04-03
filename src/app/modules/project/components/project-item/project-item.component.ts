import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Tag } from '@data/schema/tag.resource';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { ModuleType, Project, Specialization } from '@data/schema/project-service.types';
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
  projectSpecialization$: Observable<Specialization[]>;

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
      this.projectSpecialization$ = this.projectService.getSpecializationsOfProjectById(this.project.id);
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
