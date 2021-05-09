import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';

export interface ProfileBulletin {
  title: string;
  bulletins: string[];
}

@Component({
  selector: 'app-profile-page-bulletin-list',
  templateUrl: './profile-page-bulletin-list.component.html',
  styleUrls: ['./profile-page-bulletin-list.component.scss'],
  host: { class: 'profile-bulletin' }
})
export class ProfilePageBulletinListComponent implements OnInit {
  @Input()
  bulletinList: ProfileBulletin;

  constructor() {}

  ngOnInit(): void {}
}
