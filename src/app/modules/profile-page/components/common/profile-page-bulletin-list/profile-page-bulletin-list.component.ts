import { HostBinding, Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';

export interface ProfileBulletin {
  title: string;
  bulletins: string[];
}

@Component({
  selector: 'app-profile-page-bulletin-list',
  templateUrl: './profile-page-bulletin-list.component.html',
  styleUrls: ['./profile-page-bulletin-list.component.scss']
})
export class ProfilePageBulletinListComponent {
  @HostBinding('class')
  classes: string = 'profile-bulletin';

  @Input()
  bulletinList: ProfileBulletin;

  constructor() {}
}
