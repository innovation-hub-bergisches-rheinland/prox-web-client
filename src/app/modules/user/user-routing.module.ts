import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@app/guard/auth.guard';
import { UserProfilePageComponent } from '@modules/user/pages/user-profile-page/user-profile-page.component';

const routes: Routes = [
  {
    path: ''
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
