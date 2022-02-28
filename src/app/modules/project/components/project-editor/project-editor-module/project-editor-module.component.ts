import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModuleType, Specialization } from '@data/schema/project-service.types';

@Component({
  selector: 'app-project-editor-module',
  templateUrl: './project-editor-module.component.html',
  styleUrls: ['./project-editor-module.component.scss']
})
export class ProjectEditorModuleComponent implements OnInit {
  @Input()
  moduleFormGroup: FormGroup;

  @Input()
  specializations: Specialization[];

  @Input()
  modules: ModuleType[];

  @Output()
  onSpecializationSelected = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
