import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from './modules/material/material.module';
import { ContentPageModule } from './modules/content-page/components/content-page/content-page.module';

@NgModule({
  declarations: [ConfirmationDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MaterialModule,
    ContentPageModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MaterialModule,

    ContentPageModule
  ]
})
export class SharedModule {}
