import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';
import {
  SashComponent,
  SashContentDirective,
  SashTitleDirective
} from './components/sash/sash.component';
import { ProfileAvatarCardComponent } from '@modules/profile/components/profile-avatar-card/profile-avatar-card.component';
import {
  ProfileCardHeaderComponent,
  ProfileCardTitleDirective
} from '@modules/profile/components/profile-card/profile-card-header/profile-card-header.component';
import {
  ProfileCardComponent,
  ProfileCardContentDirective
} from '@modules/profile/components/profile-card/profile-card.component';
import { OrganizationPageComponent } from './pages/organization-page/organization-page.component';

@NgModule({
  declarations: [
    SashComponent,
    SashContentDirective,
    SashTitleDirective,
    ProfileAvatarCardComponent,
    ProfileCardHeaderComponent,
    ProfileCardTitleDirective,
    ProfileCardContentDirective,
    ProfileCardComponent,
    OrganizationPageComponent
  ],
  imports: [CommonModule, ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
