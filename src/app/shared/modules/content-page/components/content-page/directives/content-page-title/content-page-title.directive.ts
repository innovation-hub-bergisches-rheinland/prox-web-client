import { Directive } from '@angular/core';

@Directive({
  selector: 'app-content-page-title, [app-content-page-title], [appContentPageTitle]',
  host: {
    class: 'app-content-page-title'
  }
})
export class ContentPageTitleDirective {
  constructor() {}
}
