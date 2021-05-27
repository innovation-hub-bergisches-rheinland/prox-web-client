import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Professor } from '@data/schema/openapi/professor-profile-service/models';
import { Observable, of } from 'rxjs';

export interface ProfileVita {
  title: string;
  vita: string;
}

@Component({
  selector: 'app-profile-page-vita',
  templateUrl: './profile-page-vita.component.html',
  styleUrls: ['./profile-page-vita.component.scss'],
  host: { class: 'profile-vita' }
})
export class ProfilePageVitaComponent implements OnInit {
  @Input()
  vita: ProfileVita;

  constructor() {}

  ngOnInit(): void {}
}
