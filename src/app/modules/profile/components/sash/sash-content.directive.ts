import { Directive, HostBinding } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'app-sash-content'
})
export class SashContentDirective {
  @HostBinding('class') classes = 'app-sash-content';
}
