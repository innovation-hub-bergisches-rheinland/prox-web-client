import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TagCurationComponent } from './pages/tag-curation/tag-curation.component';

const routes: Routes = [{ path: 'tag-curation', component: TagCurationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule {}
