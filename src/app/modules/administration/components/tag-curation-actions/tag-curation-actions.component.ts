import { Component, Input } from '@angular/core';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-tag-curation-actions',
  templateUrl: './tag-curation-actions.component.html',
  styleUrls: ['./tag-curation-actions.component.scss']
})
export class TagCurationActionsComponent {
  @Input() tag: Tag;
}
