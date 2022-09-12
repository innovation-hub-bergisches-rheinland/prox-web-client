import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-lecturer-profile-editor-additional-information',
  templateUrl: './lecturer-profile-editor-additional-information.component.html',
  styleUrls: ['./lecturer-profile-editor-additional-information.component.scss']
})
export class LecturerProfileEditorAdditionalInformationComponent {
  @Input()
  userProfileAdditionalInformationForm: UntypedFormGroup;
}
