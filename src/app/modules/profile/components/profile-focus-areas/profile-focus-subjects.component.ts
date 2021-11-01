import { Component, Input, OnInit } from '@angular/core';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

export interface FocusSubject {
  readonly subject: string;
}

@Component({
  selector: 'app-profile-focus-subjects',
  templateUrl: './profile-focus-subjects.component.html',
  styleUrls: ['./profile-focus-subjects.component.scss']
})
export class ProfileFocusSubjectsComponent implements OnInit {
  faBullseye = faBullseye;

  @Input()
  subjects: FocusSubject[];

  constructor() {}

  ngOnInit(): void {}
}
