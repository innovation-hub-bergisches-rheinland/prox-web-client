import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { GeneralProfileForm } from '@modules/profile/components/profile-editor/profile-editor-general/profile-editor-general.component';
import { LecturerProfileForm } from '@modules/profile/components/profile-editor/profile-editor-lecturer/profile-editor-lecturer.component';
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
      vita: new FormControl<string>('')
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
      subjects: new FormControl<string[]>([]),
      publications: new FormControl<string[]>([])
    })
  });

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.isLecturer = this.keycloakService.isUserInRole('professor');
  }
}
