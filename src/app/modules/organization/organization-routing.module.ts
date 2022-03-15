import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationOverviewComponent } from '@modules/organization/pages/organization-overview/organization-overview.component';
import { AuthGuard } from '@app/guard/auth.guard';
import { OrganizationMembersComponent } from '@modules/organization/pages/organization-members/organization-members.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationOverviewComponent
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
