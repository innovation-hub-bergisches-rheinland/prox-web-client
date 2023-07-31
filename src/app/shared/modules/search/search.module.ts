import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecentSearchesComponent } from './components/recent-searches/recent-searches.component';
import { MaterialModule } from '../material/material.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [RecentSearchesComponent],
  imports: [CommonModule, MaterialModule, FontAwesomeModule],
  exports: [RecentSearchesComponent]
})
export class SearchModule {}
