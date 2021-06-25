import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile-page-chip-list',
  templateUrl: './profile-page-chip-list.component.html',
  styleUrls: ['./profile-page-chip-list.component.scss'],
  host: { class: 'profile-chip-list' }
})
export class ProfilePageChipListComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  items: string[];

  constructor() {}

  ngOnInit(): void {}
}
