import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '@data/service/profile.service';
import { catchError, combineLatestWith, forkJoin, map, mergeMap, of, throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { CreateLecturerRequest, Lecturer } from '@data/schema/profile.types';

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
  saved = new EventEmitter<Lecturer>();

  @Input()
  userProfile: Lecturer;

  @Input()
  id: string;

  constructor(
    private fb: UntypedFormBuilder,
    private profileService: ProfileService,
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
    const tags$ = tags ? this.tagService.synchronize(tags).pipe(map(tags => tags.tags.map(tag => tag.id))) : of([]);
    const lecturer$ = this.profileService.updateLecturer(this.id, userProfile);

    const setTags$ = lecturer$.pipe(
      combineLatestWith(tags$),
      mergeMap(([lecturer, tags]) => {
        return this.profileService.setLecturerTags(lecturer.id, tags);
      })
    );

    lecturer$
      .pipe(
        mergeMap(lecturer =>
          forkJoin({
            lecturer: of(lecturer),
            avatar: avatar && typeof avatar !== 'string' ? this.profileService.setLecturerAvatar(lecturer.id, avatar) : of(null),
            tags: setTags$
          })
        )
      )
      .subscribe({
        next: value => {
          this.notificationService.success('Benutzerprofil wurde erfolgreich gespeichert');
          this.saved.emit(value.lecturer);
        },
        error: err => {
          this.notificationService.success('Benutzerprofil konnte nicht gespeichert werden');
        }
      });
  }

  buildUserProfile(): CreateLecturerRequest {
    return {
      name: this.userProfileInformationForm.controls['name'].value,
      profile: {
        vita: this.userProfileInformationForm.controls['vita'].value ?? null,
        affiliation: this.userProfileAdditionalInformationForm.controls['affiliation'].value ?? null,
        publications: this.userProfilePublicationFormGroup.controls['publications'].value ?? null,
        email: this.userProfileInformationForm.controls['email'].value ?? null,
        collegePage: this.userProfileInformationForm.controls['collegePage'].value ?? null,
        homepage: this.userProfileInformationForm.controls['homepage'].value ?? null,
        room: this.userProfileAdditionalInformationForm.controls['room'].value ?? null,
        telephone: this.userProfileInformationForm.controls['telephone'].value ?? null,
        consultationHour: this.userProfileAdditionalInformationForm.controls['consultationHour'].value ?? null,
        subject: this.userProfileAdditionalInformationForm.controls['mainSubject'].value ?? null
      }
    };
  }

  setFormValues(lecturer: Lecturer) {
    this.userProfileInformationForm.patchValue({
      name: lecturer.name,
      homepage: lecturer.profile?.homepage,
      email: lecturer.profile?.email,
      telephone: lecturer.profile?.telephone,
      collegePage: lecturer.profile?.collegePage,
      vita: lecturer.profile.vita
    });
    this.userProfileAdditionalInformationForm.patchValue({
      affiliation: lecturer.profile?.affiliation,
      mainSubject: lecturer.profile?.subject,
      room: lecturer.profile?.room,
      consultationHour: lecturer.profile?.consultationHour
    });
    this.userProfilePublicationFormGroup.patchValue({
      publications: lecturer.profile?.publications
    });
    this.userProfileAvatarFormGroup.patchValue({
      avatar: lecturer.avatarUrl
    });

    this.userProfileAdditionalInformationForm.patchValue({
      subjects: lecturer.tags
    });
  }
}
