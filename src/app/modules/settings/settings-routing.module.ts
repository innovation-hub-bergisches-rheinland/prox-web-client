import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditorComponent } from './pages/profile-editor/profile-editor.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { PendingChangesGuard } from '@app/guard/pending-changes.guard';
import { SearchPreferencesComponent } from './pages/search-preferences/search-preferences.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'user/profile'
  },
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: 'user/profile', component: ProfileEditorComponent, canDeactivate: [PendingChangesGuard] },
      { path: 'user/search', component: SearchPreferencesComponent, canDeactivate: [PendingChangesGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
