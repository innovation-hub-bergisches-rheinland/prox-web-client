import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'app-avatar-card-title, [app-avatar-card-title], [appAvatarCardTitle]'
})
export class ProfileAvatarCardTitleDirective {
  @HostBinding('class') classes = 'app-profile-card-title';
}
