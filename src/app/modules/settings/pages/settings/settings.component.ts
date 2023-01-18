import { Component, OnInit } from '@angular/core';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  faAddressCard = faAddressCard;

  constructor() {}

  ngOnInit(): void {}
}
