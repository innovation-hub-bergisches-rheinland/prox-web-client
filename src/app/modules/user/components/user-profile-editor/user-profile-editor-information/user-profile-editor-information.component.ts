import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-profile-editor-information',
  templateUrl: './user-profile-editor-information.component.html',
  styleUrls: ['./user-profile-editor-information.component.scss']
})
export class UserProfileEditorInformationComponent implements OnInit {
  @Input()
  userProfileInformationForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
