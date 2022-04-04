import { Directive, HostBinding } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'app-sash-title'
})
export class SashTitleDirective {
  @HostBinding('class') classes = 'app-sash-title';
}
