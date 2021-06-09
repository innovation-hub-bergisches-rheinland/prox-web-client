import {
  AfterContentChecked,
  Component,
  ContentChildren,
  QueryList
} from '@angular/core';
import { ProfilePageProjectsHistoryItemComponent } from './profile-page-projects-history-item/profile-page-projects-history-item.component';

@Component({
  selector: 'app-profile-page-projects-history',
  templateUrl: './profile-page-projects-history.component.html',
  styleUrls: ['./profile-page-projects-history.component.scss'],
  host: { class: 'profile-projects-history' }
})
export class ProfilePageProjectsHistoryComponent
  implements AfterContentChecked
{
  @ContentChildren(ProfilePageProjectsHistoryItemComponent)
  _items: QueryList<ProfilePageProjectsHistoryItemComponent>;
  selectedIndex = 0;

  ngAfterContentChecked() {
    this._items.forEach(
      (item: ProfilePageProjectsHistoryItemComponent, index: number) => {
        item.position = index - this.selectedIndex;
      }
    );
  }

  goBackward() {
    //Flat Modulo https://stackoverflow.com/a/4467559/4567795
    this.selectedIndex =
      (((this.selectedIndex - 1) % this._items.length) + this._items.length) %
      this._items.length;
  }

  goForward() {
    this.selectedIndex = (this.selectedIndex + 1) % this._items.length;
  }
}
