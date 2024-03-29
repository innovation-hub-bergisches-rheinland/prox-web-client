import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DisclaimerComponent } from './pages/disclaimer/disclaimer.component';

const routes: Routes = [
  {
    path: '',
    component: DisclaimerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DisclaimerRoutingModule {}
