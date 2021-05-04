import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { concat, Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Project } from '@data/schema/project.resource';
import { Tag } from '@data/schema/tag.resource';
import { Module } from '@data/schema/module.resource';
import { ProjectService } from '@data/service/project.service';
import Autolinker from 'autolinker';
import { TextProcessor } from '@app/util/text-processor';
import { TagService } from '@data/service/tag.service';
import { ModuleType } from '@data/schema/openapi/project-service/moduleType';
import { ProfessorProfileService } from '@data/service/professor-profile.service';
import { Professor } from '@data/schema/openapi/professor-profile-service/professor';

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
  projectModules: ModuleType[];
  projectSupervisors: string[] = [];

  isTypeBA = false;
  isTypeMA = false;
  isTypePP = false;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private projectService: ProjectService,
    private tagService: TagService,
    public textProcessor: TextProcessor,
    private professorService: ProfessorProfileService
  ) {}

  ngOnInit() {
    this.projectService.getModulesOfProject(this.project).subscribe(
      res => (this.projectModules = res),
      err =>
        this.openErrorSnackBar(
          'Module konnten nicht geladen werden! Versuchen Sie es später nochmal.'
        )
    );

    this.projectTags$ = this.tagService
      .getAllTagsOfProject(this.project.id)
      .pipe(
        catchError(error => {
          this.openErrorSnackBar(
            'Tags konnten nicht geladen werden! Versuchen Sie es später nochmal.'
          );
          return throwError(error);
        })
      );

    this.loadSupervisorLinks();
  }

  private loadSupervisorLinks() {
    //Split supervisors and collect them
    const splitChars = /,|;|\//g;
    this.projectSupervisors = this.project.supervisorName
      .split(splitChars)
      .map(s => s.trim())
      .filter(s => s.length >= 0);

    this.professorService
      .findProfessorWithNameLike(this.projectSupervisors)
      .subscribe(res => {
        this.projectSupervisors = [];
        for (const [key, value] of Object.entries(res)) {
          if (value == null) {
            this.projectSupervisors.push(key);
          } else {
            this.projectSupervisors.push(
              `<a href="/lecturers/${value}">${key}</a>`
            );
          }
        }
      });
  }

  getProjectSupervisors() {
    return this.projectSupervisors.join(', ');
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
}
