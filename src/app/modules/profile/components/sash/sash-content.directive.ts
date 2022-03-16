import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'app-sash-content'
})
export class SashContentDirective {
  @HostBinding('class') classes = 'app-sash-content';

  constructor() {}
}
