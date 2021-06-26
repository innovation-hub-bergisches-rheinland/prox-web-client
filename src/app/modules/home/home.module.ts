import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';

import { SharedModule } from '@shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, HomeRoutingModule, FlexModule]
})
export class HomeModule {}
