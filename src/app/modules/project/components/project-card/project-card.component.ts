import { Component, Input, OnInit, Output } from '@angular/core';
import { ModuleType, Project, Specialization } from '@data/schema/project-service.types';
import { Tag } from '@data/schema/tag.resource';
import { Subject } from 'rxjs';

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
  hasPermission: boolean = false;

  @Input()
  showDetails: boolean = false;

  @Output()
  edit: Subject<Project> = new Subject<Project>();

  @Output()
  delete: Subject<Project> = new Subject<Project>();

  constructor() {}

  ngOnInit(): void {}

  onDeleteClick() {
    this.delete.next(this.project);
  }

  onEditClick() {
    this.edit.next(this.project);
  }
}
