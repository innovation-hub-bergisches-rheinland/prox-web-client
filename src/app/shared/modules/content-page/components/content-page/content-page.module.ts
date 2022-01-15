import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ContentPageComponent } from './components/content-page/content-page.component';
import { ContentPageHeaderComponent } from './components/content-page-header/content-page-header.component';
import { ContentPageTitleDirective } from './directives/content-page-title/content-page-title.directive';
import { ContentPageContentDirective } from './directives/content-page-content/content-page-content.directive';
import { ContentPageActionsComponent } from './components/content-page-actions/content-page-actions.component';

@NgModule({
  declarations: [
    ContentPageComponent,
    ContentPageHeaderComponent,
    ContentPageTitleDirective,
    ContentPageContentDirective,
    ContentPageActionsComponent
  ],
  imports: [CommonModule, FlexLayoutModule],
  exports: [
    ContentPageComponent,
    ContentPageHeaderComponent,
    ContentPageTitleDirective,
    ContentPageContentDirective,
    ContentPageActionsComponent
  ]
})
export class ContentPageModule {}
