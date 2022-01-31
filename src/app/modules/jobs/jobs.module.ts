import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { JobOverviewComponent } from './pages/job-overview/job-overview.component';
import { JobRoutingModule } from './jobs.routing.module';
import { JobItemComponent } from './components/job-item/job-item.component';
import { MarkdownModule } from 'ngx-markdown';
import { JobDetailsComponent } from '@modules/jobs/pages/job-details/job-details.component';
import { JobCreatorComponent } from '@modules/jobs/pages/job-creator/job-creator.component';
import { JobOfferFormComponent } from '@modules/jobs/components/job-offer-form/job-offer-form.component';
import { JobEditorComponent } from '@modules/jobs/pages/job-editor/job-editor.component';

@NgModule({
  declarations: [
    JobOverviewComponent,
    JobItemComponent,
    JobOfferFormComponent,
    JobDetailsComponent,
    JobCreatorComponent,
    JobEditorComponent
  ],
  imports: [CommonModule, SharedModule, JobRoutingModule, MarkdownModule.forChild()]
})
export class JobModule {}
