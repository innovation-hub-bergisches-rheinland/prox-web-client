import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImpressumRoutingModule } from './impressum-routing.module';
import { ImpressumComponent } from './pages/impressum/impressum.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ImpressumComponent],
  imports: [SharedModule, ImpressumRoutingModule]
})
export class ImpressumModule {}
