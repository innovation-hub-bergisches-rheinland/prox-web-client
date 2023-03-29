import { Component, Input, OnInit, Output } from '@angular/core';
import { Observable, Subject, catchError } from 'rxjs';
import { faArrowUp, faBars, faBook, faClock, faPaperclip, faPen, faStar as faSolid, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegular } from '@fortawesome/free-regular-svg-icons';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Project, ProjectState } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectEditorDialogComponent } from '../project-editor-dialog/project-editor-dialog.component';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { P } from '@angular/cdk/keycodes';
import { Tag } from '@data/schema/tag.types';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  readonly stateClasses: Partial<Record<ProjectState, string>> = {
    PROPOSED: 'border-blue-500',
    OFFERED: 'border-green-500',
    RUNNING: 'border-yellow-500',
    COMPLETED: 'border-gray-500'
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
  starSolid = faSolid;
  starRegular = faRegular;
  bookIcon = faBook;
  timerIcon = faClock;
  paperclipIcon = faPaperclip;

  canCommit = false;
  canStar = false;
  isStarred = false;
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
    this.canStar = this.project._permissions.canStateInterest;
    if (this.canStar && this.isLoggedIn) {
      this.userService.checkStar(this.project.id).subscribe({
        next: res => (this.isStarred = res)
      });
    }
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
  }

  commit() {
    this.projectService.setCommitment(this.project.id).subscribe(project => {
      this.notificationService.success('Commitment wurde erfolgreich abgegben');
      this.project = project;
      this.canCommit = false;
    });
  }

  async toggleStar() {
    if (!this.isLoggedIn) {
      await this.keycloakService.login({ redirectUri: window.location.href });
      return;
    }

    if (this.isStarred) {
      this.userService.unStar(this.project.id).subscribe({
        next: _ => {
          this.isStarred = false;
          this.project.metrics.interestedCount--;
        },
        error: _ => this.notificationService.error('Konnte Stern nicht entfernen. Versuchen Sie es später erneut')
      });
    } else {
      this.userService.star(this.project.id).subscribe({
        next: _ => {
          this.isStarred = true;
          this.project.metrics.interestedCount++;
        },
        error: _ => this.notificationService.error('Konnte keinen Stern hinzufügen. Versuchen Sie es später erneut')
      });
    }
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
