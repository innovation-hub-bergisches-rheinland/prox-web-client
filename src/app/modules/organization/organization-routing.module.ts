import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationEditorComponent } from './pages/organization-editor/organization-editor.component';
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
  },
  {
    path: 'new',
    component: OrganizationEditorComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {}
