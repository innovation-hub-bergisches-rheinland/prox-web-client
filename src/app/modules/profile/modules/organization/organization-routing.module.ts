import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationOverviewComponent } from '@modules/profile/modules/organization/pages/organization-overview/organization-overview.component';
import { OrganizationMembersComponent } from '@modules/profile/modules/organization/pages/organization-members/organization-members.component';
import { OrganizationProfileComponent } from '@modules/profile/modules/organization/pages/organization-profile/organization-profile.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationOverviewComponent
  },
  {
    path: ':id',
    component: OrganizationProfileComponent
  },
  {
    path: ':id/members',
    component: OrganizationMembersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {}
