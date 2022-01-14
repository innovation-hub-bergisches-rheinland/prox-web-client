import { Component, HostBinding, Input, OnInit } from '@angular/core';
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
        {{ language.germanName }}
      </li>
    </ul>
  `
})
export class CompanyLanguageInformationComponent {
  @HostBinding('class')
  classes: string = 'language-information';

  @Input()
  information: LanguageInformation;

  get languages(): Language[] {
    return this.information.languages.sort((a, b) =>
      a.germanName.localeCompare(b.germanName)
    );
  }

  constructor() {}
}
