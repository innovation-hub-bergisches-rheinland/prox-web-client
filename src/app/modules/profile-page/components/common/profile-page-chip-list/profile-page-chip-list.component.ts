import { HostBinding, Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page-chip-list',
  templateUrl: './profile-page-chip-list.component.html',
  styleUrls: ['./profile-page-chip-list.component.scss']
})
export class ProfilePageChipListComponent {
  @HostBinding('class')
  classes: string = 'profile-chip-list';

  @Input()
  title: string;

  @Input()
  items: string[];

  constructor() {}
}
