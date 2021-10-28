import { Component, Input, OnInit } from '@angular/core';
import { faGlobeEurope } from '@fortawesome/free-solid-svg-icons';

export interface Language {
  readonly isoIdentifier: string;
  readonly name: string;
}

@Component({
  selector: 'app-profile-language-card',
  templateUrl: './profile-language-card.component.html',
  styleUrls: ['./profile-language-card.component.scss']
})
export class ProfileLanguageCardComponent implements OnInit {
  faGlobeEurope = faGlobeEurope;

  @Input()
  languages: Language[];

  constructor() {}

  ngOnInit(): void {}
}
