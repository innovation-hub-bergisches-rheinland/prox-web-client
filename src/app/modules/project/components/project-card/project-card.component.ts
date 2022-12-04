import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@data/service/user.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Project } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectEditorDialogComponent } from '../project-editor-dialog/project-editor-dialog.component';

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

  editIcon = faPen;
  deleteIcon = faTrash;

  constructor(private projectService: ProjectService, private notificationService: NotificationService, private dialog: MatDialog) {}

  ngOnInit() {}

  onDeleteClick() {
    this.projectService.deleteProject(this.project).subscribe(() => {
      this.notificationService.success('Projekt wurde erfolgreich entfernt');
      this.deleted.next(this.project);
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
}
