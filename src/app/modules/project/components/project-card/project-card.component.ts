import { Component, Input, OnInit, Output } from '@angular/core';
import { ModuleType, Project, ProjectPermissions, Specialization } from '@data/schema/project-service.types';
import { Tag } from '@data/schema/tag.resource';
import { Observable, Subject } from 'rxjs';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@data/service/user.service';
import { Organization, UserProfile } from '@data/schema/user-service.types';
import { map } from 'rxjs/operators';

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

  constructor(private userService: UserService) {}

  ngOnInit() {
    switch (this.project.owner.discriminator) {
      case 'user':
        this.owner$ = this.userService.getUserProfile(this.project.owner.id).pipe(
          map(profile => ({
            authorName: profile.name,
            profileRouter: ['/users', this.project.owner.id]
          }))
        );
        break;
      case 'organization':
        this.owner$ = this.userService.getOrganization(this.project.owner.id).pipe(
          map(profile => ({
            authorName: profile.name,
            profileRouter: ['/organizations', this.project.owner.id]
          }))
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
