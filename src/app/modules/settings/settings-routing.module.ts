import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditorComponent } from './pages/profile-editor/profile-editor.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SettingsHomeComponent } from './pages/settings-home/settings-home.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', component: SettingsHomeComponent },
      { path: 'user/profile', component: ProfileEditorComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
