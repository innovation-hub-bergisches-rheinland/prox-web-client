import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfessorProfileEditor } from './pages/professor-profile-editor/professor-profile-editor.component';

import { ProfessorProfileComponent } from './pages/professor-profile/professor-profile.component';

const routes: Routes = [
  {
    path: ':id',
    component: ProfessorProfileComponent
  },
  {
    path: ':id/edit',
    component: ProfessorProfileEditor
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessorProfileRoutingModule {}
