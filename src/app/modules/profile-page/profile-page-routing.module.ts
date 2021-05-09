import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyOverviewComponent } from './pages/company/companies-overview/companies-overview.component';
import { CompanyProfileComponent } from './pages/company/company-profile/company-profile.component';
import { ProfessorProfileEditor } from './pages/professor/professor-profile-editor/professor-profile-editor.component';
import { ProfessorProfileComponent } from './pages/professor/professor-profile/professor-profile.component';
import { ProfessorsComponent } from './pages/professor/professors/professors.component';

const routes: Routes = [
  {
    path: 'companies',
    children: [
      {
        path: '',
        component: CompanyOverviewComponent
      },
      {
        path: ':id',
        component: CompanyProfileComponent
      },
      {
        path: 'me',
        component: CompanyProfileComponent
      }
    ]
  },
  {
    path: 'lecturers',
    children: [
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
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilePageRoutingModule {}
