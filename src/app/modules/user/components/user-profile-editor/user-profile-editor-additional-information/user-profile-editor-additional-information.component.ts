import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-profile-editor-additional-information',
  templateUrl: './user-profile-editor-additional-information.component.html',
  styleUrls: ['./user-profile-editor-additional-information.component.scss']
})
export class UserProfileEditorAdditionalInformationComponent {
  @Input()
  userProfileAdditionalInformationForm: UntypedFormGroup;
}
