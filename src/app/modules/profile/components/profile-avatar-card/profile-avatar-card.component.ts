import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-profile-avatar-card',
  templateUrl: './profile-avatar-card.component.html',
  styleUrls: ['./profile-avatar-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileAvatarCardComponent implements OnInit {
  @Input()
  avatar: string;

  @Input()
  title: string;

  @Input()
  subtitle?: string;

  constructor() {}

  ngOnInit(): void {}
}
