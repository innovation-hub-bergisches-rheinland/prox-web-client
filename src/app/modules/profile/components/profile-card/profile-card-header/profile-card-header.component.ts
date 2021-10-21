import { Component, Directive, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Directive({
  selector:
    'app-profile-card-title, [app-profile-card-title], [appProfileCardTitle]',
  host: {
    class: 'app-profile-card-title'
  }
})
export class ProfileCardTitleDirective {
  constructor() {}
}

@Component({
  selector: 'app-profile-card-header',
  templateUrl: './profile-card-header.component.html',
  styleUrls: ['./profile-card-header.component.scss']
})
export class ProfileCardHeaderComponent implements OnInit {
  @Input()
  icon: IconDefinition;

  constructor() {}

  ngOnInit(): void {}
}
