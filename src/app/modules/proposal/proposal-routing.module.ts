import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalDetailsComponent } from './pages/proposal-details/proposal-details.component';

import { ProposalComponent } from './pages/proposal/proposal.component';

const routes: Routes = [
  {
    path: '',
    component: ProposalComponent
  },
  {
    path: ':id',
    component: ProposalDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule {}
