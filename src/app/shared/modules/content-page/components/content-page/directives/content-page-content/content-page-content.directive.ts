import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: 'app-content-page-content, [app-content-page-content], [appContentPageContent]'
})
export class ContentPageContentDirective {
  @HostBinding('class') classes = 'app-content-page-content';
}
