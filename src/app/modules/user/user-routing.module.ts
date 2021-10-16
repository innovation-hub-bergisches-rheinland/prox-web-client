import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserOrganizationsComponent } from './modules/organization/page/organizations/organizations.component';

export const routes: Routes = [
  {
    path: 'organizations',
    component: UserOrganizationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
