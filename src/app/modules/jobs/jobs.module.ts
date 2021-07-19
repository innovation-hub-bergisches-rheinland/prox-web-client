import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '@shared/shared.module';
import { JobOverviewComponent } from './pages/job-overview/job-overview.component';
import { JobRoutingModule } from './jobs.routing.module';
import { JobItemComponent } from './components/job-item/job-item.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [JobOverviewComponent, JobItemComponent],
  imports: [
    CommonModule,
    SharedModule,
    FlexLayoutModule,
    JobRoutingModule,
    MarkdownModule.forChild()
  ]
})
export class JobModule {}
