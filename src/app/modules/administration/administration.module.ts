import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { TagCurationComponent } from './pages/tag-curation/tag-curation.component';

@NgModule({
  declarations: [TagCurationComponent],
  imports: [CommonModule, AdministrationRoutingModule]
})
export class AdministrationModule {}
