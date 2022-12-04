import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { MaterialModule } from './modules/material/material.module';
import { ContentPageModule } from './modules/content-page/components/content-page/content-page.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LinkyPipe } from './pipes/linky.pipe';
import { UserSearchComponent } from './components/user-search/user-search.component';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TagInputComponent } from './components/tag-input/tag-input.component';
import { OrganizationSelectorComponent } from './components/organization-selector/organization-selector.component';
import { SimpleChipInputComponent } from './components/simple-chip-input/simple-chip-input.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ChipComponent } from './components/chip/chip.component';
import { ChipListComponent } from './components/chip-list/chip-list.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { UserChipInputComponent } from '@shared/components/user-chip-input/user-chip-input.component';
import { FeatureDirectiveModule } from '@app/directive/feature-directive.module';
import { ErrorsModule } from './modules/errors/errors.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LoggerModule } from './modules/logger/logger.module';
import { StatusIconComponent } from './components/status-icon/status-icon.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    LinkyPipe,
    UserSearchComponent,
    UserSelectorComponent,
    TagInputComponent,
    OrganizationSelectorComponent,
    SimpleChipInputComponent,
    TruncatePipe,
    ChipComponent,
    ChipListComponent,
    AddButtonComponent,
    BackButtonComponent,
    PaginatorComponent,
    UserChipInputComponent,
    StatusIconComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MaterialModule,
    ContentPageModule,
    FontAwesomeModule,
    NgxMatSelectSearchModule,
    ErrorsModule,

    NotificationsModule,
    LoggerModule,

    FeatureDirectiveModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    MaterialModule,

    ContentPageModule,
    FontAwesomeModule,
    LinkyPipe,
    UserSearchComponent,
    UserSelectorComponent,
    TagInputComponent,
    OrganizationSelectorComponent,
    SimpleChipInputComponent,
    TruncatePipe,
    ChipComponent,
    ChipListComponent,
    AddButtonComponent,
    BackButtonComponent,
    PaginatorComponent,
    UserChipInputComponent,
    StatusIconComponent,

    NotificationsModule,
    LoggerModule,

    FeatureDirectiveModule,

    ErrorsModule
  ]
})
export class SharedModule {}
