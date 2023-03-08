import { Component, Input } from '@angular/core';
import { Tag } from '@data/schema/tag.types';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-tags',
  templateUrl: './profile-tags.component.html',
  styleUrls: ['./profile-tags.component.scss']
})
export class ProfileTagsComponent {
  faBullseye = faBullseye;

  @Input()
  tags: Tag[];
}
