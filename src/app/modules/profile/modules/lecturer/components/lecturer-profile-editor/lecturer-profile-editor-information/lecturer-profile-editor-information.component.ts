import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-lecturer-profile-editor-information',
  templateUrl: './lecturer-profile-editor-information.component.html',
  styleUrls: ['./lecturer-profile-editor-information.component.scss']
})
export class LecturerProfileEditorInformationComponent {
  @Input()
  userProfileInformationForm: UntypedFormGroup;
}
