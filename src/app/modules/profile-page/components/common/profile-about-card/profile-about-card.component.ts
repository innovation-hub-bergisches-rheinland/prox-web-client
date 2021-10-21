import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'profile-about-card',
  templateUrl: './profile-about-card.component.html',
  styleUrls: ['./profile-about-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileAboutCardComponent implements OnInit {
  faAdressCard = faAddressCard;

  constructor() {}

  ngOnInit(): void {}
}
