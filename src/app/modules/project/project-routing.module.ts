import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectDetailsComponent } from './pages/project-details/project-details.component';

import { ProjectComponent } from './pages/project/project.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectComponent
  },
  {
    path: ':id',
    component: ProjectDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
