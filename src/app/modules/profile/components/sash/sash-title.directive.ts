import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'app-sash-title'
})
export class SashTitleDirective {
  @HostBinding('class') classes = 'app-sash-title';

  constructor() {}
}
