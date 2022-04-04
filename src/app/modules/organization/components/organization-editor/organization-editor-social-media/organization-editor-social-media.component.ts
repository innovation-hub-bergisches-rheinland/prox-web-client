import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-organization-editor-social-media',
  templateUrl: './organization-editor-social-media.component.html',
  styleUrls: ['./organization-editor-social-media.component.scss']
})
export class OrganizationEditorSocialMediaComponent {
  @Input()
  organizationSocialMediaForm: FormGroup;
}

export function socialMediaHandleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allowed = !control.value || /^[^/]*$/g.test(control.value);
    return allowed ? null : { forbiddenHandle: { value: control.value } };
  };
}
