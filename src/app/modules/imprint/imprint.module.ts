import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ImprintRoutingModule } from './imprint-routing.module';
import { ImprintComponent } from './pages/imprint/imprint.component';

@NgModule({
  declarations: [ImprintComponent],
  imports: [SharedModule, ImprintRoutingModule]
})
export class ImprintModule {}
