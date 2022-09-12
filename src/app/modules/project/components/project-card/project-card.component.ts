import { Component, Input, OnInit, Output } from '@angular/core';
import { ModuleType, Permissions, Project, Specialization } from '@data/schema/project-service.types';
import { Subject } from 'rxjs';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@data/service/user.service';
import { Tag } from '@data/schema/tag-service.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';

interface ProjectAuthor {
  authorName: string;
  profileRouter: string[];
}

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent implements OnInit {
  @Input()
  project: Project;

  @Input()
  modules: ModuleType[];

  @Input()
  tags: Tag[];

  @Input()
  specialization: Specialization[];

  @Input()
  permissions: Permissions;

  @Input()
  showDetails = false;

  @Output()
  edit: Subject<Project> = new Subject<Project>();

  @Output()
  delete: Subject<Project> = new Subject<Project>();

  editIcon = faPen;
  deleteIcon = faTrash;

  ownerProfileRouter: string[];

  constructor(private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit() {
    switch (this.project.owner.discriminator) {
      case 'user':
        this.ownerProfileRouter = ['/users', this.project.owner.id];
        break;
      case 'organization':
        this.ownerProfileRouter = ['/organizations', this.project.owner.id];
        break;
    }
  }

  onDeleteClick() {
    this.delete.next(this.project);
  }

  onEditClick() {
    this.edit.next(this.project);
  }
}
