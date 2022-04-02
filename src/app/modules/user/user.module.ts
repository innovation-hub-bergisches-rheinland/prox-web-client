import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';

@NgModule({
  declarations: [UserProfilePageComponent],
  imports: [CommonModule, SharedModule, UserRoutingModule, ProfileModule]
})
export class UserModule {}
