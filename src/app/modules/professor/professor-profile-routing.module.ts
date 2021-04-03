import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfessorProfileEditor } from './pages/professor-profile-editor/professor-profile-editor.component';

import { ProfessorProfileComponent } from './pages/professor-profile/professor-profile.component';
import { ProfessorsComponent } from './pages/professors/professors.component';

const routes: Routes = [
  {
    path: '',
    component: ProfessorsComponent
  },
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
