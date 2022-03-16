import { ChangeDetectionStrategy, Component, ContentChildren, Input, OnInit, QueryList } from '@angular/core';

@Component({
  selector: 'app-profile-avatar-card',
  templateUrl: './profile-avatar-card.component.html',
  styleUrls: ['./profile-avatar-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileAvatarCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
