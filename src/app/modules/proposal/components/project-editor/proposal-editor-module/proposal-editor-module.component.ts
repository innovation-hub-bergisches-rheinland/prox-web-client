import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ModuleType, Specialization } from '@data/schema/project-service.types';

@Component({
  selector: 'app-proposal-editor-module',
  templateUrl: './proposal-editor-module.component.html'
})
export class ProposalEditorModuleComponent {
  @Input()
  moduleFormGroup: UntypedFormGroup;

  @Input()
  specializations: Specialization[];

  @Input()
  modules: ModuleType[];

  @Output()
  specializationSelected = new EventEmitter<any>();
}
