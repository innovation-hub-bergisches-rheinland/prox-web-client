import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LecturerProfileOverviewPageComponent } from './pages/lecturer-profile-overview-page/lecturer-profile-overview-page.component';
import { LecturerProfilePageComponent } from './pages/lecturer-profile-page/lecturer-profile-page.component';

const routes: Routes = [
  {
    path: '',
    component: LecturerProfileOverviewPageComponent
  },
  {
    path: ':id',
    component: LecturerProfilePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LecturerRoutingModule {}
