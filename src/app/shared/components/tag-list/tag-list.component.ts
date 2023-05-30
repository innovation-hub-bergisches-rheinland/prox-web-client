import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html'
})
export class TagListComponent implements OnInit {
  @Input()
  tags: Tag[];

  @Input()
  clickable = false;

  @Output()
  tagClicked: EventEmitter<Tag> = new EventEmitter<Tag>();

  get sortedTags(): Tag[] {
    return this.tags?.sort((a, b) => a.tagName.localeCompare(b.tagName)) ?? [];
  }

  constructor() {}

  ngOnInit(): void {}

  onClick(tag: Tag) {
    if (this.clickable) {
      this.tagClicked.emit(tag);
    }
  }
}
