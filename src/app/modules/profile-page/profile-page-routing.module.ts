import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyOverviewComponent } from './pages/company/companies-overview/companies-overview.component';
import { CompanyProfileEditor } from './pages/company/company-profile-editor/company-profile-editor.component';
import { CompanyProfileComponent } from './pages/company/company-profile/company-profile.component';
import { ProfessorProfileEditor } from './pages/professor/professor-profile-editor/professor-profile-editor.component';
import { ProfessorProfileComponent } from './pages/professor/professor-profile/professor-profile.component';
import { ProfessorsOverviewComponent } from './pages/professor/professors-overview/professors-overview.component';

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
      },
      {
        path: ':id/edit',
        component: CompanyProfileEditor
      }
    ]
  },
  {
    path: 'lecturers',
    children: [
      {
        path: '',
        component: ProfessorsOverviewComponent
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
