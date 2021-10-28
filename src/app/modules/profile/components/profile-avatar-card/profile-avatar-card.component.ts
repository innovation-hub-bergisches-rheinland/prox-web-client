import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

export interface SocialMedia {
  readonly facebook?: string;
  readonly instagram?: string;
  readonly twitter?: string;
  readonly xing?: string;
  readonly linkedIn?: string;
}

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

  @Input()
  socialMedia?: SocialMedia;

  constructor() {}

  ngOnInit(): void {
    console.log(this.socialMedia);
  }
}
