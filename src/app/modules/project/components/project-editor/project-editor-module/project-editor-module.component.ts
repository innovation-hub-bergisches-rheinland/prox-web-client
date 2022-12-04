import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Discipline, ModuleType } from '@data/schema/project.types';
import { ProjectService } from '@data/service/project.service';
import { Observable } from 'rxjs';

export interface CurriculumFormGroup {
  disciplines: FormControl<string[]>;
  modules: FormControl<string[]>;
}

@Component({
  selector: 'app-project-editor-module',
  templateUrl: './project-editor-module.component.html',
  styleUrls: ['./project-editor-module.component.scss']
})
export class ProjectEditorModuleComponent implements OnInit {
  @Input()
  moduleFormGroup: FormGroup<CurriculumFormGroup>;

  @Output()
  specializationSelected = new EventEmitter<any>();

  disciplines$: Observable<Discipline[]>;
  modules$: Observable<ModuleType[]>;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.disciplines$ = this.projectService.getAllDisciplines();
    this.modules$ = this.projectService.getAllModuleTypes();
  }
}
