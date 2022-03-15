import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { socialMediaHandleValidator } from '@modules/organization/components/organization-editor/organization-editor-social-media/organization-editor-social-media.component';

@Component({
  selector: 'app-organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.scss']
})
export class OrganizationEditorComponent implements OnInit {
  organizationInformationForm = this.fb.group({
    name: ['', Validators.required],
    homepage: [''],
    contactEmail: ['', Validators.email],
    vita: ['']
  });
  organizationProfileForm = this.fb.group({
    foundingDate: [''],
    numberOfEmployees: [''],
    headquarter: [''],
    quarters: [[]],
    branches: [[]]
  });
  organizationSocialMediaForm = this.fb.group({
    facebookHandle: ['', socialMediaHandleValidator()],
    twitterHandle: ['', socialMediaHandleValidator()],
    instagramHandle: ['', socialMediaHandleValidator()],
    xingHandle: ['', socialMediaHandleValidator()],
    linkedInHandle: ['', socialMediaHandleValidator()]
  });
  organizationAvatarFormGroup = this.fb.group({
    avatar: ['']
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  saveOrg() {
    /*console.log({
      avatar: this.organizationAvatarFormGroup.value,
      profile: this.organizationProfileForm.value,
      information: this.organizationInformationForm.value,
      socialMedia: this.organizationSocialMediaForm.value
    });*/
  }
}
