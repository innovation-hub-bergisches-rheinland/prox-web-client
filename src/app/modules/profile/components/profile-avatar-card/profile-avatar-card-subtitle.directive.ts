import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'app-avatar-card-subtitle, [app-avatar-card-subtitle], [appAvatarCardSubtitle]'
})
export class ProfileAvatarCardSubtitleDirective {
  @HostBinding('class') classes = 'app-profile-card-subtitle';
}
