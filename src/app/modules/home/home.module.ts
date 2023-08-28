import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { CarouselItemComponent } from './components/carousel-item/carousel-item.component';
import { CarouselComponent } from './components/carousel/carousel.component';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { ProcessStepComponent } from './components/process-step/process-step.component';
import { ProcessStepListComponent } from './components/process-step-list/process-step-list.component';
import { ProcessStepTitleDirective } from './components/process-step/process-step-title.directive';
import { ProcessStepContentDirective } from './components/process-step/process-step-content.directive';
import { ProcessStepIconDirective } from './components/process-step/process-step-icon.directive';

@NgModule({
  declarations: [
    HomeComponent,
    CarouselItemComponent,
    CarouselComponent,
    ProcessStepComponent,
    ProcessStepListComponent,
    ProcessStepTitleDirective,
    ProcessStepContentDirective,
    ProcessStepIconDirective
  ],
  imports: [SharedModule, HomeRoutingModule]
})
export class HomeModule {}
