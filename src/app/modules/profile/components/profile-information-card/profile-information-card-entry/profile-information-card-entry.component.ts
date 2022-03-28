import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-information-card-entry',
  templateUrl: './profile-information-card-entry.component.html',
  styleUrls: ['./profile-information-card-entry.component.scss']
})
export class ProfileInformationCardEntryComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  value: string;

  @Input()
  linkable: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
