import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Project, Tag, Module } from '@prox/shared/hal-resources';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'prox-project-list-item',
  templateUrl: './project-list-item.component.html',
  styleUrls: ['./project-list-item.component.scss']
})
export class ProjectListItemComponent implements OnInit {
  @Input() project: Project;
  @Input() showEditButton: boolean;
  @Input() showDeleteButton: boolean;
  @Output() editButtonClicked = new EventEmitter<any>();
  @Output() deleteButtonClicked = new EventEmitter<any>();

  showShortDescription = false;

  projectTags$: Observable<Tag[]>;
  projectModules$: Observable<Module[]>;

  isTypeBA = false;
  isTypeMA = false;
  isTypePP = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.projectModules$ = this.project.getModules();
    this.projectTags$ = this.project.getTags();

    this.containsProjectType('BA').subscribe(
      result => (this.isTypeBA = result)
    );
    this.containsProjectType('MA').subscribe(
      result => (this.isTypeMA = result)
    );
    this.containsProjectType('PP').subscribe(
      result => (this.isTypePP = result)
    );
  }

  editProject() {
    this.editButtonClicked.emit();
  }

  deleteProject() {
    this.deleteButtonClicked.emit();
  }

  toggleShortDescription() {
    this.showShortDescription = !this.showShortDescription;
  }

  containsProjectType(search: string) {
    return this.project.getModules().pipe(
      map(modules => modules.filter(module => module.projectType === search)),
      map(modules => (modules.length >= 1 ? true : false))
    );
  }
}
