import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { socialMediaHandleValidator } from '@modules/organization/components/organization-editor/organization-editor-social-media/organization-editor-social-media.component';
import { CreateOrganizationSchema, Organization, OrganizationProfile } from '@data/schema/user-service.types';
import { UserService } from '@data/service/user.service';
import { EMPTY, forkJoin, mergeMap, of } from 'rxjs';

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
    linkedInHandle: ['', socialMediaHandleValidator()],
    youtubeHandle: ['', socialMediaHandleValidator()]
  });
  organizationAvatarFormGroup = this.fb.group({
    avatar: ['']
  });

  @Output()
  onSaved = new EventEmitter<Organization>();

  @Input()
  organization: Organization | null = null;

  constructor(private fb: FormBuilder, private userService: UserService) {}

  ngOnInit(): void {
    if (this.organization) {
      this.setFormValues(this.organization);
    }
  }

  saveOrg() {
    const org = this.buildOrganization();
    const avatar = this.organizationAvatarFormGroup.controls['avatar'].value as File;
    const saveObservable =
      this.organization === null
        ? this.userService.createOrganization(org)
        : this.userService.updateOrganization(this.organization.id, org);

    saveObservable
      .pipe(
        mergeMap(org =>
          forkJoin({
            org: of(org),
            avatar: avatar && typeof avatar !== 'string' ? this.userService.setOrganizationAvatar(org.id, avatar) : of(null)
          })
        )
      )
      .subscribe({
        next: value => {
          this.onSaved.emit(value.org);
        },
        error: err => console.log(err)
      });
  }

  buildOrganization(): CreateOrganizationSchema {
    return {
      name: this.organizationInformationForm.controls['name'].value,
      profile: {
        vita: this.organizationInformationForm.controls['vita'].value,
        contactEmail: this.organizationInformationForm.controls['contactEmail'].value,
        homepage: this.organizationInformationForm.controls['homepage'].value,
        ...(this.organizationProfileForm.value as Omit<OrganizationProfile, 'vita' | 'homepage' | 'contactEmail'>),
        socialMedia: this.organizationSocialMediaForm.value
      }
    };
  }

  setFormValues(organization: Organization) {
    this.organizationInformationForm.patchValue({
      name: organization.name,
      homepage: organization.profile.homepage,
      contactEmail: organization.profile.contactEmail,
      vita: organization.profile.vita
    });
    this.organizationProfileForm.patchValue({
      foundingDate: organization.profile.foundingDate,
      numberOfEmployees: organization.profile.numberOfEmployees,
      headquarter: organization.profile.headquarter,
      quarters: organization.profile.quarters,
      branches: organization.profile.branches
    });
    this.organizationSocialMediaForm.patchValue({
      ...organization.profile.socialMedia
    });
    this.userService.getOrganizationAvatar(organization.id).subscribe({
      next: value =>
        this.organizationAvatarFormGroup.patchValue({
          avatar: value
        })
    });
  }
}
