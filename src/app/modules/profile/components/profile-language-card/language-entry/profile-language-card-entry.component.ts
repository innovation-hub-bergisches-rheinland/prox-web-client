import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Language } from '@modules/profile-page/components/common/profile-language-card/profile-language-card.component';

@Component({
  selector: 'app-profile-language-card-entry',
  templateUrl: './profile-language-card-entry.component.html',
  styleUrls: ['./profile-language-card-entry.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileLanguageCardEntryComponent implements OnInit {
  @Input()
  isoIdentifier: string;

  @Input()
  name: string;

  constructor() {}

  ngOnInit(): void {}
}
