import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from './modules/material/material.module';
import { ContentPageModule } from './modules/content-page/components/content-page/content-page.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LinkyPipe } from './pipes/linky.pipe';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TagInputComponent } from './components/tag-input/tag-input.component';
import { ContextSelectorComponent } from './components/context-selector/context-selector.component';
import { SimpleChipInputComponent } from './components/simple-chip-input/simple-chip-input.component';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    LinkyPipe,
    UserSearchComponent,
    UserSelectorComponent,
    TagInputComponent,
    ContextSelectorComponent,
    SimpleChipInputComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MaterialModule,
    ContentPageModule,
    FontAwesomeModule,
    NgxMatSelectSearchModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MaterialModule,

    ContentPageModule,
    FontAwesomeModule,
    LinkyPipe,
    UserSearchComponent,
    UserSelectorComponent,
    TagInputComponent,
    ContextSelectorComponent,
    SimpleChipInputComponent,
    TruncatePipe
  ]
})
export class SharedModule {}
