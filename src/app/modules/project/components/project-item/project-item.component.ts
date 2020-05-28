import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Project } from '@data/schema/project.resource';
import { Tag } from '@data/schema/tag.resource';
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

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.projectModules$ = this.project.getModules().pipe(
      catchError(error => {
        this.openErrorSnackBar(
          'Module konnten nicht geladen werden! Versuchen Sie es später nochmal.'
        );
        return throwError(error);
      })
    );

    this.projectTags$ = this.project.getTags().pipe(
      catchError(error => {
        this.openErrorSnackBar(
          'Tags konnten nicht geladen werden! Versuchen Sie es später nochmal.'
        );
        return throwError(error);
      })
    );

    this.containsProjectType('BA').subscribe(result => {
      this.isTypeBA = result;
    });
    this.containsProjectType('MA').subscribe(result => {
      this.isTypeMA = result;
    });
    this.containsProjectType('PP').subscribe(result => {
      this.isTypePP = result;
    });
  }
  openErrorSnackBar(message: string) {
    this.snackBar.open(message, 'Verstanden');
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
