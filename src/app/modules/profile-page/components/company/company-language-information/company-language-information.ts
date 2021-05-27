import { Component, Input, OnInit } from '@angular/core';
import { Language } from '@data/schema/openapi/company-profile-service/language';

export interface LanguageInformation {
  title: string;
  languages: Language[];
}

@Component({
  selector: 'app-company-language-information',
  styleUrls: ['company-language-information.scss'],
  template: `
    <h1>{{ information.title }}</h1>
    <ul>
      <li *ngFor="let language of languages">
        <span
          [ngClass]="[
            'flag-icon',
            language.iso3166Mapping
              ? 'flag-icon-' + language.iso3166Mapping
              : 'placeholder-flag'
          ]"
        ></span>
        {{ language.germanName }}
      </li>
    </ul>
  `,
  host: { class: 'language-information' }
})
export class CompanyLanguageInformationComponent implements OnInit {
  @Input()
  information: LanguageInformation;

  get languages(): Language[] {
    return this.information.languages.sort((a, b) =>
      a.germanName.localeCompare(b.germanName)
    );
  }

  constructor() {}

  ngOnInit(): void {}
}
