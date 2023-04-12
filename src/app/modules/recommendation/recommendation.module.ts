import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendationCardComponent } from './components/recommendation-card/recommendation-card.component';
import { RecommendationListEntryComponent } from './components/recommendation-list-entry/recommendation-list-entry.component';
import { RecommendationListComponent } from './components/recommendation-list/recommendation-list.component';
import { SharedModule } from '@shared/shared.module';
import { RecommendationListEntryTitleDirective } from './components/recommendation-list-entry/recommendation-list-entry-title.directive';

@NgModule({
  declarations: [
    RecommendationCardComponent,
    RecommendationListEntryComponent,
    RecommendationListComponent,
    RecommendationListEntryTitleDirective
  ],
  exports: [RecommendationCardComponent],
  imports: [CommonModule, SharedModule]
})
export class RecommendationModule {}
