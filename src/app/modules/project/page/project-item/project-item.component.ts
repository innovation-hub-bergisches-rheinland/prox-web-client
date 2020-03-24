import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project } from '@data/schema/project.resource';
import { Observable } from 'rxjs';
import { Tag } from '@data/schema/tag.resource';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { Module } from '@data/schema/module.resource';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {
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
