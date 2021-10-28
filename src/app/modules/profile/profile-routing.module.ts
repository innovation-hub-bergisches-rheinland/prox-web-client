import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationPageComponent } from '@modules/profile/pages/organization-page/organization-page.component';
import { LecturerPageComponent } from '@modules/profile/pages/lecturer-page/lecturer-page.component';
import { OrganizationEditorPageComponent } from '@modules/profile/pages/organization-editor-page/organization-editor-page.component';
import { LecturerEditorPageComponent } from '@modules/profile/pages/lecturer-editor-page/lecturer-editor-page.component';
import { LecturerOverviewPageComponent } from '@modules/profile/pages/lecturer-overview-page/lecturer-overview-page.component';
import { OrganizationOverviewPageComponent } from '@modules/profile/pages/organization-overview-page/organization-overview-page.component';

const routes: Routes = [
  {
    path: 'orgs',
    children: [
      {
        path: '',
        component: OrganizationOverviewPageComponent
      },
      {
        path: ':id',
        component: OrganizationPageComponent
      },
      {
        path: ':id/edit',
        component: OrganizationEditorPageComponent
      }
    ]
  },
  {
    path: 'lecturers',
    children: [
      {
        path: '',
        component: LecturerOverviewPageComponent
      },
      {
        path: ':id',
        component: LecturerPageComponent
      },
      {
        path: ':id/edit',
        component: LecturerEditorPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
