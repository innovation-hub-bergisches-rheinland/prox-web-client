import { AfterContentChecked, Component, ContentChildren, QueryList } from '@angular/core';
import { ProfileProjectHistoryItemComponent } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import { faHistory } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-project-history',
  templateUrl: './profile-project-history.component.html',
  styleUrls: ['./profile-project-history.component.scss']
})
export class ProfileProjectHistoryComponent implements AfterContentChecked {
  @ContentChildren(ProfileProjectHistoryItemComponent)
  _items: QueryList<ProfileProjectHistoryItemComponent>;
  selectedIndex = 0;
  icon = faHistory;

  ngAfterContentChecked() {
    this._items.forEach((item: ProfileProjectHistoryItemComponent, index: number) => {
      item.position = index - this.selectedIndex;
    });
  }

  goBackward() {
    // Flat Modulo https://stackoverflow.com/a/4467559/4567795
    this.selectedIndex = (((this.selectedIndex - 1) % this._items.length) + this._items.length) % this._items.length;
  }

  goForward() {
    this.selectedIndex = (this.selectedIndex + 1) % this._items.length;
  }
}
