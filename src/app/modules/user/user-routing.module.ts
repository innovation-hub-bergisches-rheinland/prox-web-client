import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePageComponent } from '@modules/user/pages/user-profile-page/user-profile-page.component';
import { UserProfileOverviewPageComponent } from '@modules/user/pages/user-profile-overview-page/user-profile-overview-page.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileOverviewPageComponent
  },
  {
    path: ':id',
    component: UserProfilePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
