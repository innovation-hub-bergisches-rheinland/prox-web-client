import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '@shared/components/user-chip-input/user-chip-input.component';

export interface InformationFormGroup {
  title: FormControl<string>;
  summary: FormControl<string>;
  description: FormControl<string>;
  requirement: FormControl<string>;
  supervisors: FormControl<User[]>;
  partner: FormControl<string>;
}

@Component({
  selector: 'app-project-editor-information',
  templateUrl: './project-editor-information.component.html',
  styleUrls: ['./project-editor-information.component.scss']
})
export class ProjectEditorInformationComponent {
  @Input()
  informationFormGroup: FormGroup<InformationFormGroup>;

  @Input()
  isEdit: boolean;
}
