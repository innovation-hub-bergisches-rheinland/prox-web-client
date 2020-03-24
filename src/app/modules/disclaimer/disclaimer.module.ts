import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { DisclaimerRoutingModule } from './disclaimer-routing.module';
import { DisclaimerComponent } from './page/disclaimer/disclaimer.component';

@NgModule({
  declarations: [DisclaimerComponent],
  imports: [SharedModule, DisclaimerRoutingModule]
})
export class DisclaimerModule {}
