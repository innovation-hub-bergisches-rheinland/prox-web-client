import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-organization-editor-profile',
  templateUrl: './organization-editor-profile.component.html',
  styleUrls: ['./organization-editor-profile.component.scss']
})
export class OrganizationEditorProfileComponent {
  @Input()
  organizationProfileFormGroup: UntypedFormGroup;
}
