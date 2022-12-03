import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Discipline, ModuleType } from '@data/schema/project.types';

@Component({
  selector: 'app-project-editor-module',
  templateUrl: './project-editor-module.component.html',
  styleUrls: ['./project-editor-module.component.scss']
})
export class ProjectEditorModuleComponent {
  @Input()
  moduleFormGroup: UntypedFormGroup;

  @Input()
  specializations: Discipline[];

  @Input()
  modules: ModuleType[];

  @Output()
  specializationSelected = new EventEmitter<any>();
}
