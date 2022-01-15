import {
  Component,
  Directive,
  HostBinding,
  Input,
  OnInit
} from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Directive({
  selector:
    'app-profile-card-title, [app-profile-card-title], [appProfileCardTitle]'
})
export class ProfileCardTitleDirective {
  @HostBinding('class') classes = 'app-profile-card-title';

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
