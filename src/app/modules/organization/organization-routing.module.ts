import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganizationEditorComponent } from './pages/organization-editor/organization-editor.component';

const routes: Routes = [
  {
    path: 'new',
    component: OrganizationEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {}
