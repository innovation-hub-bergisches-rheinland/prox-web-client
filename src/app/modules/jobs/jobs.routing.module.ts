import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobOverviewComponent } from './pages/job-overview/job-overview.component';

const routes: Routes = [
  {
    path: '',
    component: JobOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule {}
