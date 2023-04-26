import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { TagCurationComponent } from './pages/tag-curation/tag-curation.component';
import { SharedModule } from '@shared/shared.module';
import { TagCurationTableComponent } from './components/tag-curation-table/tag-curation-table.component';
import { TagMergeDialogComponent } from './components/tag-merge-dialog/tag-merge-dialog.component';
import { TagEditDialogComponent } from './components/tag-edit-dialog/tag-edit-dialog.component';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@NgModule({
  declarations: [TagCurationComponent, TagCurationTableComponent, TagMergeDialogComponent, TagEditDialogComponent],
  imports: [CommonModule, AdministrationRoutingModule, SharedModule],
  providers: []
})
export class AdministrationModule {}
