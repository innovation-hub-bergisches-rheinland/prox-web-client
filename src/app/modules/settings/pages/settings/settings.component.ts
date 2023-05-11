import { Component, OnInit } from '@angular/core';
import { faSearchengin } from '@fortawesome/free-brands-svg-icons';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  faAddressCard = faAddressCard;
  faSearchengin = faSearchengin;

  constructor() {}

  ngOnInit(): void {}
}
