import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

export interface LecturerProfileForm {
  visibleInPublicSearch: FormControl<boolean>;
  homepage: FormControl<string>;
  email: FormControl<string>;
  telephone: FormControl<string>;
  collegePage: FormControl<string>;
  affiliation: FormControl<string>;
  mainSubject: FormControl<string>;
  consultationHour: FormControl<string>;
  room: FormControl<string>;
  publications: FormControl<string[]>;
}

@Component({
  selector: 'app-profile-editor-lecturer',
  templateUrl: './profile-editor-lecturer.component.html'
})
export class ProfileEditorLecturerComponent implements OnInit {
  @Input()
  formGroup: FormGroup<LecturerProfileForm>;

  constructor() {}

  ngOnInit(): void {}
}
