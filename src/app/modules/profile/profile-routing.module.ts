import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationPageComponent } from '@modules/profile/pages/organization-page/organization-page.component';

const routes: Routes = [
  {
    path: 'orgs',
    children: [
      {
        path: ':id',
        component: OrganizationPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
