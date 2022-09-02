import { Component, Input, OnInit, Output } from '@angular/core';
import { ModuleType, Project, ProjectPermissions, Specialization } from '@data/schema/project-service.types';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@data/service/user.service';
import { Organization, UserProfile } from '@data/schema/user-service.types';
import { catchError, map } from 'rxjs/operators';
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
  permissions: ProjectPermissions;

  @Input()
  showDetails = false;

  @Output()
  edit: Subject<Project> = new Subject<Project>();

  @Output()
  delete: Subject<Project> = new Subject<Project>();

  editIcon = faPen;
  deleteIcon = faTrash;

  owner$: Observable<ProjectAuthor>;

  constructor(private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit() {
    switch (this.project.owner.discriminator) {
      case 'user':
        this.owner$ = this.userService.getUserProfile(this.project.owner.id).pipe(
          map(profile => ({
            authorName: profile.name,
            profileRouter: ['/users', this.project.owner.id]
          })),
          catchError(err => {
            // This will probably flood the view as we are doing this for every project
            // this.notificationService.warning('Ersteller konnte nicht geladen werden.');
            return EMPTY;
          })
        );
        break;
      case 'organization':
        this.owner$ = this.userService.getOrganization(this.project.owner.id).pipe(
          map(profile => ({
            authorName: profile.name,
            profileRouter: ['/organizations', this.project.owner.id]
          })),
          catchError(err => {
            // This will probably flood the view as we are doing this for every project
            // this.notificationService.warning('Ersteller konnte nicht geladen werden.');
            return EMPTY;
          })
        );
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
