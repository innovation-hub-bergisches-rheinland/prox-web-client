import { Component, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { RecommendationListEntryComponent } from '../recommendation-list-entry/recommendation-list-entry.component';

@Component({
  selector: 'app-recommendation-list',
  templateUrl: './recommendation-list.component.html',
  styleUrls: ['./recommendation-list.component.scss']
})
export class RecommendationListComponent {
  @Input() title: string;
}
