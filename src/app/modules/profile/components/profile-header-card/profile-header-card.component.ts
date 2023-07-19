import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tag } from '@data/schema/tag.types';
import { faEdit, faPencil } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-header-card',
  templateUrl: './profile-header-card.component.html',
  styleUrls: ['./profile-header-card.component.scss']
})
export class ProfileHeaderCardComponent {
  faEdit = faPencil;

  @Input()
  title: string;

  @Input()
  imageSrc: string;

  @Input()
  showEdit = false;

  @Input()
  roundedAvatar = true;

  @Input()
  tags: Tag[] = [];

  @Output()
  editClicked = new EventEmitter<MouseEvent>();
}
