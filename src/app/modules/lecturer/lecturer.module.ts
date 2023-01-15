import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LecturerRoutingModule } from './lecturer-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { LecturerProfilePageComponent } from './pages/lecturer-profile-page/lecturer-profile-page.component';
import { LecturerProfileOverviewPageComponent } from './pages/lecturer-profile-overview-page/lecturer-profile-overview-page.component';
import { LecturerItemComponent } from '@modules/lecturer/components/lecturer-item/lecturer-item.component';

@NgModule({
  declarations: [LecturerProfilePageComponent, LecturerProfileOverviewPageComponent, LecturerItemComponent],
  imports: [CommonModule, SharedModule, LecturerRoutingModule, ProfileModule]
})
export class LecturerModule {}
