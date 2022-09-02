import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ModuleType, Specialization } from '@data/schema/project-service.types';

@Component({
  selector: 'app-project-editor-module',
  templateUrl: './project-editor-module.component.html',
  styleUrls: ['./project-editor-module.component.scss']
})
export class ProjectEditorModuleComponent {
  @Input()
  moduleFormGroup: UntypedFormGroup;

  @Input()
  specializations: Specialization[];

  @Input()
  modules: ModuleType[];

  @Output()
  specializationSelected = new EventEmitter<any>();
}
