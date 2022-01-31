import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobOverviewComponent } from './pages/job-overview/job-overview.component';
import { JobDetailsComponent } from '@modules/jobs/pages/job-details/job-details.component';
import { JobCreatorComponent } from '@modules/jobs/pages/job-creator/job-creator.component';
import { JobEditorComponent } from '@modules/jobs/pages/job-editor/job-editor.component';

const routes: Routes = [
  {
    path: '',
    component: JobOverviewComponent
  },
  {
    path: 'create',
    component: JobCreatorComponent
  },
  {
    path: ':id',
    component: JobDetailsComponent
  },
  {
    path: ':id/edit',
    component: JobEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule {}
