import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationPageComponent } from '@modules/profile/pages/organization-page/organization-page.component';
import { LecturerPageComponent } from '@modules/profile/pages/lecturer-page/lecturer-page.component';

const routes: Routes = [
  {
    path: 'orgs',
    children: [
      {
        path: ':id',
        component: OrganizationPageComponent
      }
    ]
  },
  {
    path: 'lecturers',
    children: [
      {
        path: ':id',
        component: LecturerPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
