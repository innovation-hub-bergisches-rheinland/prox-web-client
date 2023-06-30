import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { faArrowUp, faBars, faBook, faCircle, faCircleInfo, faClock, faPaperclip, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Project, ProjectState } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectEditorDialogComponent } from '../project-editor-dialog/project-editor-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Tag } from '@data/schema/tag.types';
import { UserService } from '@data/service/user.service';

type ProjectStateDefinition = {
  iconClass: string;
  borderClass: string;
  text: string;
  hint: string;
};

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  readonly stateDefinitions: Partial<Record<ProjectState, ProjectStateDefinition>> = {
    PROPOSED: {
      iconClass: 'text-blue-500',
      borderClass: 'border-blue-500',
      text: 'Vorschlag',
      hint: 'Dieses Projekt ist ein Vorschlag. Es wird zu einem verfügbaren Projekt umgeformt, wenn sich ein Lehrender bereiterklärt, dieses zu betreuen'
    },
    OFFERED: {
      iconClass: 'text-green-500',
      borderClass: 'border-green-500',
      text: 'Verfügbar',
      hint: 'Dieses Projekt ist verfügbar. Sie können Kontakt zu dem Lehrenden aufnehmen, um sich für dieses Projekt zu bewerben'
    },
    RUNNING: {
      iconClass: 'text-yellow-500',
      borderClass: 'border-yellow-500',
      text: 'Laufend',
      hint: 'Dieses Projekt wird aktuell bearbeitet.'
    },
    COMPLETED: {
      iconClass: 'text-gray-500',
      borderClass: 'border-gray-500',
      text: 'Abgeschlossen',
      hint: 'Dieses Projekt ist abgeschlossen. Es kann nicht mehr bearbeitet werden.'
    }
  };

  @Input()
  project: Project;

  @Input()
  showDetails = false;

  @Output()
  deleted = new Subject<Project>();

  @Output()
  tagClicked = new Subject<Tag>();

  editIcon = faPen;
  deleteIcon = faTrash;
  commitIcon = faArrowUp;
  barsIcon = faBars;
  bookIcon = faBook;
  timerIcon = faClock;
  paperclipIcon = faPaperclip;
  circleIcon = faCircle;
  circleInfoIcon = faCircleInfo;

  canCommit = false;
  isLoggedIn = false;

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private keycloakService: KeycloakService
  ) {}

  async ngOnInit() {
    this.canCommit = this.project.status.state === 'PROPOSED' && this.keycloakService.isUserInRole('professor');
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
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
      data: {
        project: this.project
      }
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

  onTagClick(tag: Tag) {
    this.tagClicked.next(tag);
  }
}
