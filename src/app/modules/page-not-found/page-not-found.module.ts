import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { PageNotFoundRoutingModule } from './page-not-found-routing.module';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [SharedModule, PageNotFoundRoutingModule]
})
export class PageNotFoundModule {}
