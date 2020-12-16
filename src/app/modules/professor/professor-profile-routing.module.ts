import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfessorProfileComponent } from './pages/professor-profile/professor-profile.component';

const routes: Routes = [
  {
    path: ':id',
    component: ProfessorProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorProfileRoutingModule {}
