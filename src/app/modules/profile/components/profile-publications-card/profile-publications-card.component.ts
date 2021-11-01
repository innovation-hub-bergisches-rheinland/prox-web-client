import { Input, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { faBook } from '@fortawesome/free-solid-svg-icons';

export interface Publication {
  readonly publication: string;
}

@Component({
  selector: 'app-profile-publications-card',
  templateUrl: './profile-publications-card.component.html',
  styleUrls: ['./profile-publications-card.component.scss']
})
export class ProfilePublicationsCardComponent implements OnInit {
  icon = faBook;

  @Input()
  publications: Publication[];

  limit = 10;

  constructor() {}

  ngOnInit(): void {}
}
