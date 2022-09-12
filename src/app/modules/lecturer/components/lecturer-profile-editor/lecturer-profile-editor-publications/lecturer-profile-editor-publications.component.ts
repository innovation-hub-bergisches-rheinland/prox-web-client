import { Component, Input } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-lecturer-profile-editor-publications',
  templateUrl: './lecturer-profile-editor-publications.component.html',
  styleUrls: ['./lecturer-profile-editor-publications.component.scss']
})
export class LecturerProfileEditorPublicationsComponent {
  @Input()
  userProfilePublicationsForm: UntypedFormGroup;

  publicationInput: UntypedFormControl = new UntypedFormControl(
    '',
    Validators.compose([Validators.minLength(1), Validators.maxLength(1023)])
  );

  addPublication(pub: string) {
    this.userProfilePublicationsForm.controls['publications'].value.push(pub);
    this.publicationInput.setValue('');
  }

  removePublication(idx: number) {
    this.userProfilePublicationsForm.controls['publications'].value.splice(idx, 1);
  }
}
