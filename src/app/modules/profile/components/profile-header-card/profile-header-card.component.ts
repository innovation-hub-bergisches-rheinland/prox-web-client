import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-profile-header-card',
  templateUrl: './profile-header-card.component.html',
  styleUrls: ['./profile-header-card.component.scss']
})
export class ProfileHeaderCardComponent {
  @Input()
  title: string;

  @Input()
  imageSrc: string;

  @Input()
  showEdit: boolean;

  @Input()
  roundedAvatar = true;

  @Input()
  tags: Tag[] = [];

  @Output()
  editClicked = new EventEmitter<MouseEvent>();
}
