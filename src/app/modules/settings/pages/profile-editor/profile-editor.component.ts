import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentCanDeactivate } from '@app/guard/pending-changes.guard';
import { CreateLecturerProfileRequest, CreateUserProfileRequest, UserProfile } from '@data/schema/user.types';
import { TagService } from '@data/service/tag.service';
import { UserService } from '@data/service/user.service';
import { GeneralProfileForm } from '@modules/settings/components/profile-editor-general/profile-editor-general.component';
import { LecturerProfileForm } from '@modules/settings/components/profile-editor-lecturer/profile-editor-lecturer.component';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { KeycloakService } from 'keycloak-angular';
import { Observable, catchError, forkJoin, map, mergeMap, of } from 'rxjs';

@Component({
  templateUrl: './profile-editor.component.html'
})
export class ProfileEditorComponent implements OnInit, ComponentCanDeactivate {
  isLecturer = false;

  private avatarGroup = new FormGroup({
    avatar: new FormControl<File | string>(null)
  });

  private generalGroup = new FormGroup<GeneralProfileForm>({
    visibleInPublicSearch: new FormControl<boolean>(true, Validators.required),
    displayName: new FormControl<string>('', Validators.required),
    avatar: this.avatarGroup,
    vita: new FormControl<string>(''),
    homepage: new FormControl<string>(''),
    email: new FormControl<string>('', Validators.email),
    telephone: new FormControl<string>(''),
    tags: new FormControl<string[]>([])
  });

  private lecturerGroup = new FormGroup<LecturerProfileForm>({
    collegePage: new FormControl<string>(''),
    affiliation: new FormControl<string>(''),
    mainSubject: new FormControl<string>(''),
    consultationHour: new FormControl<string>(''),
    room: new FormControl<string>(''),
    publications: new FormControl<string[]>([])
  });

  formGroup = new FormGroup({
    general: this.generalGroup,
    lecturer: this.lecturerGroup
  });

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserService,
    private tagService: TagService,
    private notificationService: NotificationService
  ) {}

  @HostListener('window:beforeunload')
  canDeactivate() {
    return !this.formGroup.dirty;
  }

  async ngOnInit() {
    this.isLecturer = this.keycloakService.isUserInRole('professor');
    this.refreshProfile();
  }

  onSave() {
    const saveActions$: Observable<unknown>[] = [];
    const isTagsDirty = this.generalGroup.controls.tags.dirty;
    const isAvatarDirty = this.generalGroup.controls.avatar.dirty;
    const isGeneralProfileDirty = this.generalGroup.dirty;
    const isLecturerProfileDirty = this.lecturerGroup.dirty;

    if (isTagsDirty) {
      saveActions$.push(this.updateTags());
    }

    if (isAvatarDirty) {
      saveActions$.push(this.updateAvatar());
    }

    if (isGeneralProfileDirty) {
      saveActions$.push(this.updateGeneralProfile());
    }

    if (isLecturerProfileDirty) {
      saveActions$.push(this.updateLecturerProfile());
    }

    forkJoin(saveActions$).subscribe({
      next: () => {
        this.notificationService.success('Profil wurde erfolgreich aktualisiert');
        this.refreshProfile();
      },
      error: err => {
        this.notificationService.error('Konnte Profil nicht updaten, versuchen Sie es später erneut');
        console.error(err);
      }
    });
  }

  private refreshProfile() {
    this.userService.getCurrentAuthenticated().subscribe({
      next: up => {
        if (up.avatarUrl !== null) {
          // Cache evict
          up.avatarUrl += `?lastmod=${Date.now()}`;
        }

        this.setProfile(up);
        this.formGroup.markAsPristine();
      },
      error: err => {
        this.notificationService.error('Profil konnte nicht geladen werden, versuchen Sie es später erneut');
        console.error(err);
      }
    });
  }

  private setProfile(profile: UserProfile) {
    const lecturerProfile = profile.lecturerProfile?.profile;
    this.formGroup.patchValue({
      general: {
        visibleInPublicSearch: profile?.visibleInPublicSearch,
        avatar: {
          avatar: profile?.avatarUrl
        },
        displayName: profile.displayName,
        vita: profile?.vita,
        homepage: profile.contact?.homepage,
        email: profile.contact?.email,
        telephone: profile.contact?.telephone,
        tags: profile?.tags.map(t => t.tagName)
      },
      lecturer: {
        collegePage: lecturerProfile?.collegePage,
        affiliation: lecturerProfile?.affiliation,
        mainSubject: lecturerProfile?.subject,
        consultationHour: lecturerProfile?.consultationHour,
        room: lecturerProfile?.room,
        publications: lecturerProfile?.publications
      }
    });
  }

  private updateTags(): Observable<unknown> {
    const tags = this.generalGroup.controls.tags.value;
    const tags$ = tags ? this.tagService.synchronize(tags).pipe(map(tags => tags.tags.map(tag => tag.id))) : of([]);
    return tags$.pipe(mergeMap(tags => this.userService.setUserTags(tags)));
  }

  private updateAvatar(): Observable<unknown> {
    const avatar = this.avatarGroup.controls.avatar.value;

    if (avatar instanceof File) {
      return this.userService.setUserAvatar(avatar);
    }
    return of();
  }

  private updateGeneralProfile(): Observable<unknown> {
    const ctrls = this.generalGroup.controls;
    const generalProfile: CreateUserProfileRequest = {
      visibleInPublicSearch: ctrls.visibleInPublicSearch.value,
      displayName: ctrls.displayName.value,
      vita: ctrls.vita.value,
      contact: {
        homepage: ctrls.homepage.value,
        email: ctrls.email.value,
        telephone: ctrls.telephone.value
      }
    };
    return this.userService.setUserProfile(generalProfile);
  }

  private updateLecturerProfile(): Observable<unknown> {
    const ctrls = this.lecturerGroup.controls;
    const lecturerProfile: CreateLecturerProfileRequest = {
      profile: {
        collegePage: ctrls.collegePage.value,
        affiliation: ctrls.affiliation.value,
        subject: ctrls.mainSubject.value,
        consultationHour: ctrls.consultationHour.value,
        room: ctrls.room.value,
        publications: ctrls.publications.value
      }
    };
    return this.userService.setLecturerProfile(lecturerProfile);
  }
}
