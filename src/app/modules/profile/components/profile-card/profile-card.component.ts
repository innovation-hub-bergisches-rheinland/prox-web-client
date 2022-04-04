import { Component, Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'app-profile-card-content, [app-profile-card-content], [appProfileCardContent]'
})
export class ProfileCardContentDirective {
  @HostBinding('class') classes = 'app-profile-card-content';
}

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input()
  title: string;
}
