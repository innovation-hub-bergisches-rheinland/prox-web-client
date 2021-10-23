import { Component, Input, OnInit } from '@angular/core';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-information-card',
  templateUrl: './profile-information-card.component.html',
  styleUrls: ['./profile-information-card.component.scss']
})
export class ProfileInformationCardComponent implements OnInit {
  faAddressCard = faAddressCard;

  constructor() {}

  ngOnInit(): void {}
}
