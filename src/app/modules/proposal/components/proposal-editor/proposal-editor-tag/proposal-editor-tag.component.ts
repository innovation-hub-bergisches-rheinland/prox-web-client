import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-proposal-editor-tag',
  templateUrl: './proposal-editor-tag.component.html'
})
export class ProposalEditorTagComponent {
  @Input()
  tagFormGroup: UntypedFormGroup;
}
