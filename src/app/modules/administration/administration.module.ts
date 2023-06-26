import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { TagCurationComponent } from './pages/tag-curation/tag-curation.component';
import { SharedModule } from '@shared/shared.module';
import { TagCurationTableComponent } from './components/tag-curation-table/tag-curation-table.component';
import { TagMergeDialogComponent } from './components/tag-merge-dialog/tag-merge-dialog.component';
import { TagEditDialogComponent } from './components/tag-edit-dialog/tag-edit-dialog.component';
import { TagFindDialogComponent } from './components/tag-find-dialog/tag-find-dialog.component';
import { TagSplitDialogComponent } from './components/tag-split-dialog/tag-split-dialog.component';

@NgModule({
  declarations: [
    TagCurationComponent,
    TagCurationTableComponent,
    TagMergeDialogComponent,
    TagEditDialogComponent,
    TagFindDialogComponent,
    TagSplitDialogComponent
  ],
  imports: [CommonModule, AdministrationRoutingModule, SharedModule],
  providers: []
})
export class AdministrationModule {}
