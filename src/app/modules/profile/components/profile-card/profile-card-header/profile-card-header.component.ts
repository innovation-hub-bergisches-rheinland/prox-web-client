import { Component, Directive, HostBinding, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Directive({
  selector: 'app-profile-card-title, [app-profile-card-title], [appProfileCardTitle]'
})
export class ProfileCardTitleDirective {
  @HostBinding('class') classes = 'app-profile-card-title';
}

@Component({
  selector: 'app-profile-card-header',
  templateUrl: './profile-card-header.component.html',
  styleUrls: ['./profile-card-header.component.scss']
})
export class ProfileCardHeaderComponent {
  @Input()
  icon: IconDefinition;
}
