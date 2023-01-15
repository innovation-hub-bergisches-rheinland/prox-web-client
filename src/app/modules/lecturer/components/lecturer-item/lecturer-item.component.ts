import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lecturer-item',
  templateUrl: './lecturer-item.component.html',
  styleUrls: ['./lecturer-item.component.scss']
})
export class LecturerItemComponent {
  @Input()
  title: string;

  @Input()
  subtitle: string;

  @Input()
  secondarySubtitle: string;

  @Input()
  defaultImage = '/assets/images/blank-profile-picture.png';

  @Input()
  href: string;
  @Input()
  imgSrc: string = this.defaultImage;
  @Input()
  chipTitle: string;

  private _chips: string[] = [];

  get chips(): string[] {
    return this._chips.filter(s => s && s.trim().length > 0);
  }

  @Input()
  set chips(chips: string[]) {
    this._chips = chips;
  }
}
