import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-proposal-editor-information',
  templateUrl: './proposal-editor-information.component.html'
})
export class ProposalEditorInformationComponent {
  @Input()
  informationFormGroup: UntypedFormGroup;

  @Input()
  isEdit: boolean;
}
