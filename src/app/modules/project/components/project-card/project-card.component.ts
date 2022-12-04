import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@data/service/user.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Project } from '@data/schema/project.types';

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
  edit: Subject<Project> = new Subject<Project>();

  @Output()
  delete: Subject<Project> = new Subject<Project>();

  editIcon = faPen;
  deleteIcon = faTrash;

  constructor(private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit() {}

  onDeleteClick() {
    this.delete.next(this.project);
  }

  onEditClick() {
    this.edit.next(this.project);
  }
}
