import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent implements OnInit {
  @Input()
  avatar: string;

  @Input()
  title: string;

  @Input()
  subtitle?: string;

  constructor() {}

  ngOnInit(): void {}
}
