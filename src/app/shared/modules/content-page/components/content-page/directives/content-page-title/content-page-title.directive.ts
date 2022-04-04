import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'app-content-page-title, [app-content-page-title], [appContentPageTitle]'
})
export class ContentPageTitleDirective {
  @HostBinding('class') classes = 'app-content-page-title';
}
