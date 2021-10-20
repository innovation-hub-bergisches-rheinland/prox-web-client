import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'profile-about-card',
  templateUrl: './profile-about-card.component.html',
  styleUrls: ['./profile-about-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileAboutCardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
