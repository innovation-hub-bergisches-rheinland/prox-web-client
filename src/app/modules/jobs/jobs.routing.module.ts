import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobOverviewComponent } from './pages/job-overview/job-overview.component';
import { JobEditorComponent } from '@modules/jobs/pages/job-editor/job-editor.component';

const routes: Routes = [
  {
    path: '',
    component: JobOverviewComponent
  },
  {
    path: 'create',
    component: JobEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule {}
