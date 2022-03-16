import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-organization-editor-social-media',
  templateUrl: './organization-editor-social-media.component.html',
  styleUrls: ['./organization-editor-social-media.component.scss']
})
export class OrganizationEditorSocialMediaComponent implements OnInit {
  @Input()
  organizationSocialMediaForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}

export function socialMediaHandleValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const allowed = !control.value || /^[^/.]*$/g.test(control.value);
    return allowed ? null : { forbiddenHandle: { value: control.value } };
  };
}
