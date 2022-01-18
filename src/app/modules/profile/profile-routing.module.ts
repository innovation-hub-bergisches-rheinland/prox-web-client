import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationPageComponent } from '@modules/profile/pages/organization-page/organization-page.component';
import { LecturerPageComponent } from '@modules/profile/pages/lecturer-page/lecturer-page.component';
import { OrganizationEditorPageComponent } from '@modules/profile/pages/organization-editor-page/organization-editor-page.component';
import { LecturerEditorPageComponent } from '@modules/profile/pages/lecturer-editor-page/lecturer-editor-page.component';
import { LecturerOverviewPageComponent } from '@modules/profile/pages/lecturer-overview-page/lecturer-overview-page.component';
import { OrganizationOverviewPageComponent } from '@modules/profile/pages/organization-overview-page/organization-overview-page.component';
import { IdParamEqualsSubjectGuard } from '@modules/profile/guards/id-param-equals-subject-guard.service';
import { IsLoggedInGuard } from '@modules/profile/guards/is-logged-in.guard';
import { HasLecturerRoleGuard } from '@modules/profile/guards/has-lecturer-role.guard';
import { HasOrganizationRoleGuard } from '@modules/profile/guards/has-organization-role.guard';

const routes: Routes = [
  {
    path: 'orgs',
    children: [
      {
        path: '',
        component: OrganizationOverviewPageComponent
      },
      {
        path: 'new',
        component: OrganizationEditorPageComponent,
        canActivate: [IsLoggedInGuard, HasOrganizationRoleGuard]
      },
      {
        path: ':id',
        component: OrganizationPageComponent
      },
      {
        path: ':id/edit',
        component: OrganizationEditorPageComponent,
        canActivate: [IsLoggedInGuard, HasOrganizationRoleGuard]
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
        component: LecturerEditorPageComponent,
        canActivate: [
          IsLoggedInGuard,
          HasLecturerRoleGuard,
          IdParamEqualsSubjectGuard
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
