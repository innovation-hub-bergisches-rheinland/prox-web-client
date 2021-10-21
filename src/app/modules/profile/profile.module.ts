import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';
import {
  SashComponent,
  SashContentDirective,
  SashTitleDirective
} from './components/sash/sash.component';
import { ExamplePageComponent } from './pages/example-page/example-page.component';
import { ProfileAvatarCardComponent } from '@modules/profile/components/profile-avatar-card/profile-avatar-card.component';

@NgModule({
  declarations: [
    SashComponent,
    SashContentDirective,
    SashTitleDirective,
    ExamplePageComponent,
    ProfileAvatarCardComponent
  ],
  imports: [CommonModule, ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
