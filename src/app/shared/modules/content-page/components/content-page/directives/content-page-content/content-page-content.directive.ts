import { Directive } from '@angular/core';

@Directive({
  selector: 'app-content-page-content, [app-content-page-content], [appContentPageContent]',
  host: {
    class: 'app-content-page-content'
  }
})
export class ContentPageContentDirective {
  constructor() {}
}
