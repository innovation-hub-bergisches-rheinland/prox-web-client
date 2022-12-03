import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { socialMediaHandleValidator } from '@modules/organization/components/organization-editor/organization-editor-social-media/organization-editor-social-media.component';
import { ProfileService } from '@data/service/profile.service';
import { combineLatest, combineLatestWith, filter, forkJoin, map, mergeMap, of } from 'rxjs';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { CreateOrganizationRequest, Organization, OrganizationProfile } from '@data/schema/profile.types';

@Component({
  selector: 'app-organization-editor',
  templateUrl: './organization-editor.component.html',
  styleUrls: ['./organization-editor.component.scss']
})
export class OrganizationEditorComponent implements OnInit {
  organizationInformationForm = this.fb.group({
    name: ['', Validators.required],
    homepage: [''],
    /*
     * EMail validation is disabled because it is a valid use case to specify multiple EMail addresses
     * which we currently do not offer. Since the Email itself does not have any clear
     * semantics at the moment we simply allow any kind of string. For the future it is thinkable to
     * deprecate the organization-wide email address and simple list members with their EMail address
     * as representatives
     */
    contactEmail: ['' /*, Validators.email*/],
    vita: ['']
  });
  organizationProfileForm = this.fb.group({
    foundingDate: [''],
    numberOfEmployees: [''],
    headquarter: [''],
    quarters: [''],
    branches: [[]]
  });
  organizationSocialMediaForm = this.fb.group({
    FACEBOOK: ['', socialMediaHandleValidator()],
    TWITTER: ['', socialMediaHandleValidator()],
    INSTAGRAM: ['', socialMediaHandleValidator()],
    XING: ['', socialMediaHandleValidator()],
    LINKEDIN: ['', socialMediaHandleValidator()],
    YOUTUBE: ['', socialMediaHandleValidator()]
  });
  organizationAvatarFormGroup = this.fb.group({
    avatar: ['']
  });

  @Output()
  save = new EventEmitter<Organization>();

  @Input()
  organization: Organization | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private profileService: ProfileService,
    private tagService: TagService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    if (this.organization) {
      this.setFormValues(this.organization);
    }
  }

  saveOrg() {
    const org = this.buildOrganization();
    const avatar = this.organizationAvatarFormGroup.controls['avatar'].value as File;
    const org$ =
      this.organization === null
        ? this.profileService.createOrganization(org)
        : this.profileService.updateOrganization(this.organization.id, org);
    const tags = this.organizationProfileForm.controls['branches'].value as string[];

    const tags$ = tags ? this.tagService.synchronize(tags).pipe(map(tags => tags.tags.map(tag => tag.id))) : of([]);
    const setTags$ = org$.pipe(
      combineLatestWith(tags$),
      mergeMap(([org, tags]) => {
        return this.profileService.setOrganizationTags(org.id, tags);
      })
    );

    org$
      .pipe(
        mergeMap(org =>
          forkJoin({
            org: of(org),
            avatar: avatar && typeof avatar !== 'string' ? this.profileService.setOrganizationAvatar(org.id, avatar) : of(null),
            tags: setTags$
          })
        )
      )
      .subscribe({
        next: value => {
          this.notificationService.success('Organisation wurde erfolgreich gespeichert');
          this.save.emit(value.org);
        },
        error: err => {
          this.notificationService.error('Ein Fehler beim Speichern der Organisation ist aufgetreten. Versuchen Sie es später erneut.');
        }
      });
  }

  buildOrganization(): CreateOrganizationRequest {
    return {
      name: this.organizationInformationForm.controls['name'].value,
      profile: {
        vita: this.organizationInformationForm.controls['vita'].value,
        contactEmail: this.organizationInformationForm.controls['contactEmail'].value,
        homepage: this.organizationInformationForm.controls['homepage'].value,
        ...(this.organizationProfileForm.value as Omit<OrganizationProfile, 'vita' | 'homepage' | 'contactEmail'>),
        socialMediaHandles: this.organizationSocialMediaForm.value
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
      quarters: organization.profile.quarters
    });
    this.organizationSocialMediaForm.patchValue({
      ...organization.profile.socialMediaHandles
    });
    this.organizationAvatarFormGroup.patchValue({
      avatar: organization.logoUrl
    });

    // TODO
    /*this.tagService.getTagsForEntity(organization.id).subscribe({
      next: value => this.organizationProfileForm.patchValue({ branches: value })
    });*/
  }
}
