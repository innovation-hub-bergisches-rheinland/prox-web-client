import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-profile-overview-card',
  templateUrl: './profile-overview-card.component.html',
  styleUrls: ['./profile-overview-card.component.scss']
})
export class ProfileOverviewCardComponent {
  @HostBinding('class')
  classes: string = 'profile-overview';

  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  secondarySubtitle: string;

  @Input()
  href: string;
  @Input()
  imgSrc: string;
  @Input()
  chipTitle: string;
  @Input()
  defaultImage: string = '/assets/images/blank-profile-picture.png';

  constructor() {}

  private _chips: string[] = [];

  get chips(): string[] {
    return this._chips.filter(s => s && s.trim().length > 0);
  }

  @Input()
  set chips(chips: string[]) {
    this._chips = chips;
  }
}
