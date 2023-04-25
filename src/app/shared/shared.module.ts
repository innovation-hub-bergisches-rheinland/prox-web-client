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
import { TagComponent } from './components/tag/tag.component';
import { AddButtonComponent } from './components/add-button/add-button.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { UserChipInputComponent } from '@shared/components/user-chip-input/user-chip-input.component';
import { FeatureDirectiveModule } from '@app/directive/feature-directive.module';
import { ErrorsModule } from './modules/errors/errors.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LoggerModule } from './modules/logger/logger.module';
import { StatusIconComponent } from './components/status-icon/status-icon.component';
import { ImageInputComponent } from './components/image-input/image-input.component';
import { TagListComponent } from './components/tag-list/tag-list.component';
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { CardComponent } from './components/card/card.component';
import { PluckPipe } from './pipes/pluck.pipe';
import { TextBannerComponent } from './components/text-banner/text-banner.component';
import { TagSelectionComponent } from './components/tag-selection/tag-selection.component';

@NgModule({
  declarations: [
    ConfirmationDialogComponent,
    LinkyPipe,
    RelativeTimePipe,
    UserSearchComponent,
    UserSelectorComponent,
    TagInputComponent,
    OrganizationSelectorComponent,
    SimpleChipInputComponent,
    TruncatePipe,
    TagComponent,
    TagListComponent,
    AddButtonComponent,
    BackButtonComponent,
    PaginatorComponent,
    UserChipInputComponent,
    StatusIconComponent,
    ImageInputComponent,
    SortPipe,
    CardComponent,
    PluckPipe,
    TextBannerComponent,
    TagSelectionComponent
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
    RelativeTimePipe,
    UserSearchComponent,
    UserSelectorComponent,
    TagInputComponent,
    OrganizationSelectorComponent,
    SimpleChipInputComponent,
    TruncatePipe,
    TagComponent,
    TagListComponent,
    AddButtonComponent,
    BackButtonComponent,
    PaginatorComponent,
    UserChipInputComponent,
    StatusIconComponent,
    NotificationsModule,
    LoggerModule,
    ConfirmationDialogComponent,
    ImageInputComponent,
    TextBannerComponent,
    TagSelectionComponent,

    CardComponent,

    FeatureDirectiveModule,

    ErrorsModule,
    SortPipe,
    PluckPipe
  ]
})
export class SharedModule {}
