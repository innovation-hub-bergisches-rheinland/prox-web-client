import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { faArrowUp, faBars, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Project, ProjectState } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectEditorDialogComponent } from '../project-editor-dialog/project-editor-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { P } from '@angular/cdk/keycodes';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input()
  project: Project;

  @Input()
  showDetails = false;

  @Output()
  deleted = new Subject<Project>();

  @Output()
  tagClicked = new Subject<string>();

  editIcon = faPen;
  deleteIcon = faTrash;
  commitIcon = faArrowUp;
  barsIcon = faBars;
  canCommit = false;

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit() {
    this.canCommit = this.project.status.state === 'PROPOSED' && this.keycloakService.isUserInRole('professor');
  }

  commit() {
    this.projectService.setCommitment(this.project.id).subscribe(project => {
      this.notificationService.success('Commitment wurde erfolgreich abgegben');
      this.project = project;
      this.canCommit = false;
    });
  }

  onDeleteClick() {
    const confirmationDialog = this.dialog.open(ConfirmationDialogComponent, {
      autoFocus: true,
      maxHeight: '85vh',
      data: {
        title: 'Projekt löschen?',
        message: 'Möchten Sie das Projekt wirklich löschen?'
      }
    });

    confirmationDialog.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProject(this.project).subscribe(() => {
          this.notificationService.success('Projekt wurde erfolgreich entfernt');
          this.deleted.next(this.project);
        });
      }
    });
  }

  onEditClick() {
    const dialogRef = this.dialog.open(ProjectEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: this.project
    });
    dialogRef.afterClosed().subscribe((project: Project) => {
      if (project) {
        this.project = project;
        this.notificationService.success('Projekt wurde erfolgreich bearbeitet');
      }
    });
  }

  onStatusChange(state: ProjectState) {
    this.projectService.setState(this.project.id, state).subscribe((project: Project) => {
      this.notificationService.success('Status wurde erfolgreich aktualisiert');
      this.project = project;
    });
  }

  onTagClick(tag: string) {
    this.tagClicked.next(tag);
  }
}
