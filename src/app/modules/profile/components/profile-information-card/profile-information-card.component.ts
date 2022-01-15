import {
  Component,
  ContentChildren,
  Input,
  OnInit,
  QueryList
} from '@angular/core';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons';
import { ProfileInformationCardEntryComponent } from '@modules/profile/components/profile-information-card/profile-information-card-entry/profile-information-card-entry.component';

export interface AboutEntry {
  readonly key: string;
  readonly value: string;
  readonly linkable?: boolean;
}

@Component({
  selector: 'app-profile-information-card',
  templateUrl: './profile-information-card.component.html',
  styleUrls: ['./profile-information-card.component.scss']
})
export class ProfileInformationCardComponent implements OnInit {
  faAddressCard = faAddressCard;

  @ContentChildren(ProfileInformationCardEntryComponent)
  _items: QueryList<ProfileInformationCardEntryComponent>;

  @Input()
  entries: AboutEntry[];

  constructor() {}

  ngOnInit(): void {}
}
