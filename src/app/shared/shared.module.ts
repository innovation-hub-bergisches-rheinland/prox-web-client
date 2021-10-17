import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from './modules/material.module';
import { ContentPageComponent } from './components/content-page/content-page.component';

@NgModule({
  declarations: [ConfirmationDialogComponent, ContentPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    FlexLayoutModule,

    MaterialModule,

    ContentPageComponent
  ]
})
export class SharedModule {}
