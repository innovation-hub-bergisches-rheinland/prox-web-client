import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyProfileComponent } from './pages/company-profile/company-profile/company-profile.component';

const routes: Routes = [
  {
    path: ':id',
    component: CompanyProfileComponent
  },
  {
    path: '/me',
    component: CompanyProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyProfileRoutingModule {}
