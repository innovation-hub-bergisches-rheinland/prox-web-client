import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { UserProfile } from '@data/schema/user.types';
import { UserService } from '@data/service/user.service';
import { GeneralProfileForm } from '@modules/profile/components/profile-editor/profile-editor-general/profile-editor-general.component';
import { LecturerProfileForm } from '@modules/profile/components/profile-editor/profile-editor-lecturer/profile-editor-lecturer.component';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {
  isLecturer = false;
  formGroup = new FormGroup({
    general: new FormGroup<GeneralProfileForm>({
      displayName: new FormControl<string>('', Validators.required),
      avatar: new FormGroup({
        avatar: new FormControl<File>(null)
      }),
      vita: new FormControl<string>(''),
      tags: new FormControl<string[]>([])
    }),
    lecturer: new FormGroup<LecturerProfileForm>({
      homepage: new FormControl<string>(''),
      email: new FormControl<string>(''),
      telephone: new FormControl<string>('', Validators.email),
      collegePage: new FormControl<string>(''),
      affiliation: new FormControl<string>(''),
      mainSubject: new FormControl<string>(''),
      consultationHour: new FormControl<string>(''),
      room: new FormControl<string>(''),
      publications: new FormControl<string[]>([])
    })
  });

  constructor(
    private keycloakService: KeycloakService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    this.isLecturer = this.keycloakService.isUserInRole('professor');
    this.userService.getCurrentAuthenticated().subscribe({
      next: up => this.setProfile(up),
      error: err => {
        this.notificationService.error('Profil konnte nicht geladen werden, versuchen Sie es später erneut');
        console.log(err);
      }
    });
  }

  private setProfile(profile: UserProfile) {
    const lecturerProfile = profile.lecturerProfile.profile;
    this.formGroup.patchValue({
      general: {
        displayName: profile.displayName,
        vita: profile.lecturerProfile.profile.vita,
        tags: profile.lecturerProfile.tags.map(t => t.tagName)
      },
      lecturer: {
        homepage: lecturerProfile.homepage,
        email: lecturerProfile.email,
        telephone: lecturerProfile.telephone,
        collegePage: lecturerProfile.collegePage,
        affiliation: lecturerProfile.affiliation,
        mainSubject: lecturerProfile.subject,
        consultationHour: lecturerProfile.consultationHour,
        room: lecturerProfile.room,
        publications: lecturerProfile.publications
      }
    });
  }
}
