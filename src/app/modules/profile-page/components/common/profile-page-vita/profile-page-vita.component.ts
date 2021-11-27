import { HostBinding, Input, OnInit } from '@angular/core';
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
  styleUrls: ['./profile-page-vita.component.scss']
})
export class ProfilePageVitaComponent {
  @HostBinding('class')
  classes: string = 'profile-vita';

  @Input()
  vita: ProfileVita;

  constructor() {}
}
