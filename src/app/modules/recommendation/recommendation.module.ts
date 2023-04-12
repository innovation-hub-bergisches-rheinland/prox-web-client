import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecommendationCardComponent } from './components/recommendation-card/recommendation-card.component';
import { RecommendationListEntryComponent } from './components/recommendation-list-entry/recommendation-list-entry.component';
import { RecommendationListComponent } from './components/recommendation-list/recommendation-list.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [RecommendationCardComponent, RecommendationListEntryComponent, RecommendationListComponent],
  exports: [RecommendationCardComponent],
  imports: [CommonModule, SharedModule]
})
export class RecommendationModule {}
