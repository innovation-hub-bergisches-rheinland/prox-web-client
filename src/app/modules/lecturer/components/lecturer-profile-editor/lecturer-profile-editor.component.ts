import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UserService } from '@data/service/user.service';
import { catchError, forkJoin, mergeMap, of, throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { CreateUserProfileSchema, UserProfile } from '@data/schema/user-service.types';

@Component({
  selector: 'app-lecturer-profile-editor',
  templateUrl: './lecturer-profile-editor.component.html',
  styleUrls: ['./lecturer-profile-editor.component.scss']
})
export class LecturerProfileEditorComponent implements OnInit {
  userProfileInformationForm = this.fb.group({
    name: ['', Validators.required],
    homepage: [''],
    email: ['', Validators.email],
    telephone: [''],
    collegePage: [''],
    vita: ['']
  });
  userProfileAdditionalInformationForm = this.fb.group({
    affiliation: [''],
    mainSubject: [''],
    room: [''],
    consultationHour: [''],
    subjects: [[]]
  });
  userProfileAvatarFormGroup = this.fb.group({
    avatar: ['']
  });
  userProfilePublicationFormGroup = this.fb.group({
    publications: [[]]
  });

  @Output()
  saved = new EventEmitter<UserProfile>();

  @Input()
  userProfile: UserProfile;

  @Input()
  id: string;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private tagService: TagService,
    private keycloakService: KeycloakService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.setFormValues(this.userProfile);
  }

  saveUserProfile() {
    const userProfile = this.buildUserProfile();
    const avatar = this.userProfileAvatarFormGroup.controls['avatar'].value as File;
    const tags = this.userProfileAdditionalInformationForm.controls['subjects'].value as string[];

    this.userService
      .createUserProfile(this.id, userProfile)
      .pipe(
        mergeMap(profile =>
          forkJoin({
            profile: of(profile),
            avatar: avatar && typeof avatar !== 'string' ? this.userService.setUserAvatar(this.id, avatar) : of(null),
            tags: tags ? this.tagService.synchronize(tags) : of(null)
          })
        )
      )
      .subscribe({
        next: value => {
          this.notificationService.success('Benutzerprofil wurde erfolgreich gespeichert');
          this.saved.emit(value.profile);
        },
        error: err => {
          this.notificationService.success('Benutzerprofil konnte nicht gespeichert werden');
        }
      });
  }

  buildUserProfile(): CreateUserProfileSchema {
    return {
      name: this.userProfileInformationForm.controls['name'].value,
      vita: this.userProfileInformationForm.controls['vita'].value ?? null,
      affiliation: this.userProfileAdditionalInformationForm.controls['affiliation'].value ?? null,
      mainSubject: this.userProfileAdditionalInformationForm.controls['mainSubject'].value ?? null,
      publications: this.userProfilePublicationFormGroup.controls['publications'].value ?? null,
      contactInformation: {
        email: this.userProfileInformationForm.controls['email'].value ?? null,
        collegePage: this.userProfileInformationForm.controls['collegePage'].value ?? null,
        homepage: this.userProfileInformationForm.controls['homepage'].value ?? null,
        room: this.userProfileAdditionalInformationForm.controls['room'].value ?? null,
        telephone: this.userProfileInformationForm.controls['telephone'].value ?? null,
        consultationHour: this.userProfileAdditionalInformationForm.controls['consultationHour'].value ?? null
      }
    };
  }

  setFormValues(userProfile: UserProfile) {
    this.userProfileInformationForm.patchValue({
      name: userProfile.name,
      homepage: userProfile.contactInformation?.homepage,
      email: userProfile.contactInformation?.email,
      telephone: userProfile.contactInformation?.telephone,
      collegePage: userProfile.contactInformation?.collegePage,
      vita: userProfile.vita
    });
    this.userProfileAdditionalInformationForm.patchValue({
      affiliation: userProfile.affiliation,
      mainSubject: userProfile.mainSubject,
      room: userProfile.contactInformation?.room,
      consultationHour: userProfile.contactInformation?.consultationHour
    });
    this.userProfilePublicationFormGroup.patchValue({
      publications: userProfile.publications
    });
    this.userProfileAvatarFormGroup.patchValue({
      avatar: this.userService.getUserAvatar(this.id)
    });

    // TODO
    /*
    this.tagService
      .getTagsForEntity(this.id)
      .pipe(
        catchError(err => {
          this.notificationService.error('Tags konnten nicht geladen werden');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: tags => {
          this.userProfileAdditionalInformationForm.patchValue({
            subjects: tags
          });
        }
      });*/
  }
}
