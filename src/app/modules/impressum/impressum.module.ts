import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ImpressumRoutingModule } from './impressum-routing.module';
import { ImpressumComponent } from './pages/impressum/impressum.component';

@NgModule({
  declarations: [ImpressumComponent],
  imports: [SharedModule, ImpressumRoutingModule]
})
export class ImpressumModule {}
