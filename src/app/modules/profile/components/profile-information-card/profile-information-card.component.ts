import { Component, Input, OnInit } from '@angular/core';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

export interface AboutEntry {
  key: string;
  value: string;
  linkable?: boolean;
}

@Component({
  selector: 'app-profile-information-card',
  templateUrl: './profile-information-card.component.html',
  styleUrls: ['./profile-information-card.component.scss']
})
export class ProfileInformationCardComponent implements OnInit {
  faAddressCard = faAddressCard;

  @Input()
  entries: AboutEntry[];

  constructor() {}

  ngOnInit(): void {}
}
