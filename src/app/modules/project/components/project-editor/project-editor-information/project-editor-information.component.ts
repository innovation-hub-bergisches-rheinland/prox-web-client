import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Lecturer } from '@data/schema/lecturer.types';
import { User } from '@data/schema/user.types';

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
