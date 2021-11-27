import { NgModule } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';

import { SharedModule } from '@shared/shared.module';
import { CarouselItemComponent } from './components/carousel-item/carousel-item.component';
import { CarouselComponent } from './components/carousel/carousel.component';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [HomeComponent, CarouselItemComponent, CarouselComponent],
  imports: [SharedModule, HomeRoutingModule, FlexModule]
})
export class HomeModule {}
