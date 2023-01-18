import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface GeneralProfileForm {
  displayName: FormControl<string>;
  avatar: FormGroup<{ avatar: FormControl<File | string | null> }>;
  vita: FormControl<string>;
  tags: FormControl<string[]>;
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
