import { Component, Directive, HostBinding, Input, OnInit } from '@angular/core';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Directive({
  selector: 'app-profile-card-content, [app-profile-card-content], [appProfileCardContent]'
})
export class ProfileCardContentDirective {
  @HostBinding('class') classes = 'app-profile-card-content';

  constructor() {}
}

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent implements OnInit {
  @Input()
  icon: IconDefinition;

  @Input()
  title: string;

  constructor() {}

  ngOnInit(): void {}
}
