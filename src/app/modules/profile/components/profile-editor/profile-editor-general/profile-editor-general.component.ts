import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface GeneralProfileForm {
  displayName: FormControl<string>;
  avatar: FormGroup<{ avatar: FormControl<File> }>;
  vita: FormControl<string>;
}

@Component({
  selector: 'app-profile-editor-general',
  templateUrl: './profile-editor-general.component.html'
})
export class ProfileEditorGeneralComponent implements OnInit {
  @Input()
  formGroup: FormGroup<GeneralProfileForm>;

  constructor() {}

  ngOnInit(): void {}
}
