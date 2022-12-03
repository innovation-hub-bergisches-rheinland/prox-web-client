import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Discipline, ModuleType } from '@data/schema/project.types';

@Component({
  selector: 'app-proposal-editor-module',
  templateUrl: './proposal-editor-module.component.html'
})
export class ProposalEditorModuleComponent {
  @Input()
  moduleFormGroup: UntypedFormGroup;

  @Input()
  disciplines: Discipline[];

  @Input()
  modules: ModuleType[];

  @Output()
  specializationSelected = new EventEmitter<any>();
}
