import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html'
})
export class TagComponent implements OnInit {
  @Input()
  tag: Tag;

  @Input()
  clickable = false;

  @Output()
  tagClicked: EventEmitter<Tag> = new EventEmitter<Tag>();

  constructor() {}

  ngOnInit(): void {}

  onClick() {
    if (this.clickable) {
      this.tagClicked.emit(this.tag);
    }
  }
}
