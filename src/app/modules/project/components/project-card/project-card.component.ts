import { Component, Input, Output } from '@angular/core';
import { ModuleType, Project, Specialization } from '@data/schema/project-service.types';
import { Tag } from '@data/schema/tag.resource';
import { Subject } from 'rxjs';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input()
  project: Project;

  @Input()
  modules: ModuleType[];

  @Input()
  tags: Tag[];

  @Input()
  specialization: Specialization[];

  @Input()
  hasPermission = false;

  @Input()
  showDetails = false;

  @Output()
  edit: Subject<Project> = new Subject<Project>();

  @Output()
  delete: Subject<Project> = new Subject<Project>();

  editIcon = faPen;
  deleteIcon = faTrash;

  onDeleteClick() {
    this.delete.next(this.project);
  }

  onEditClick() {
    this.edit.next(this.project);
  }
}
