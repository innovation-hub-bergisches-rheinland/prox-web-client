import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { TagCurationComponent } from './pages/tag-curation/tag-curation.component';
import { SharedModule } from '@shared/shared.module';
import { TagCurationTableComponent } from './components/tag-curation-table/tag-curation-table.component';
import { TagCurationActionsComponent } from './components/tag-curation-actions/tag-curation-actions.component';

@NgModule({
  declarations: [TagCurationComponent, TagCurationTableComponent, TagCurationActionsComponent],
  imports: [CommonModule, AdministrationRoutingModule, SharedModule]
})
export class AdministrationModule {}
