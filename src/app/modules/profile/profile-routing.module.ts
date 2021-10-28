import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationPageComponent } from '@modules/profile/pages/organization-page/organization-page.component';
import { LecturerPageComponent } from '@modules/profile/pages/lecturer-page/lecturer-page.component';
import { OrganizationEditorPageComponent } from '@modules/profile/pages/organization-editor-page/organization-editor-page.component';
import { LecturerEditorPageComponent } from '@modules/profile/pages/lecturer-editor-page/lecturer-editor-page.component';

const routes: Routes = [
  {
    path: 'orgs',
    children: [
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
