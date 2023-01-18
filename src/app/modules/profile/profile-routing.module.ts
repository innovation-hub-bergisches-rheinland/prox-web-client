import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditorComponent } from './pages/profile-editor/profile-editor.component';

const routes: Routes = [
  {
    path: 'user/profile',
    component: ProfileEditorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
