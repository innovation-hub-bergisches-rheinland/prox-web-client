import { Component, Input } from '@angular/core';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-recommendation-list-entry',
  templateUrl: './recommendation-list-entry.component.html',
  styleUrls: ['./recommendation-list-entry.component.scss']
})
export class RecommendationListEntryComponent {
  @Input() imgUrl: string;

  @Input() tags: Tag[];

  get tagNames(): string {
    return this.tags.map(tag => tag.tagName).join(', ') || 'Keine Tags';
  }
}
