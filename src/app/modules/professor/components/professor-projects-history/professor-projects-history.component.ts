import { Input, OnInit } from '@angular/core';
import {
  AfterContentChecked,
  Component,
  ContentChildren,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { Project } from '@data/schema/project.resource';
import { Observable } from 'rxjs';
import { ProfessorProjectsHistoryItemComponent } from '../professor-projects-history-item/professor-projects-history-item.component';

@Component({
  selector: 'app-professor-projects-history',
  templateUrl: './professor-projects-history.component.html',
  styleUrls: ['./professor-projects-history.component.scss'],
  host: { class: 'prof-projects-history' }
})
export class ProfessorProjectsHistoryComponent implements AfterContentChecked {
  @ContentChildren(ProfessorProjectsHistoryItemComponent)
  _items: QueryList<ProfessorProjectsHistoryItemComponent>;
  selectedIndex = 0;

  ngAfterContentChecked() {
    this._items.forEach(
      (item: ProfessorProjectsHistoryItemComponent, index: number) => {
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
