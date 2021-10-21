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

@NgModule({
  declarations: [
    SashComponent,
    SashContentDirective,
    SashTitleDirective,
    ExamplePageComponent
  ],
  imports: [CommonModule, ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
