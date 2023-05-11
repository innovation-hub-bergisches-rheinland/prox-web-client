import { NgModule } from '@angular/core';

import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ProfileEditorAvatarComponent } from './components/profile-editor-avatar/profile-editor-avatar.component';
import { ProfileEditorGeneralComponent } from './components/profile-editor-general/profile-editor-general.component';
import { ProfileEditorLecturerComponent } from './components/profile-editor-lecturer/profile-editor-lecturer.component';
import { ProfileEditorPublicationsComponent } from './components/profile-editor-publications/profile-editor-publications.component';
import { ProfileEditorComponent } from './pages/profile-editor/profile-editor.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SearchPreferencesComponent } from './pages/search-preferences/search-preferences.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    ProfileEditorAvatarComponent,
    ProfileEditorGeneralComponent,
    ProfileEditorLecturerComponent,
    ProfileEditorPublicationsComponent,
    ProfileEditorComponent,
    SettingsComponent,
    SearchPreferencesComponent
  ],
  imports: [ScrollingModule, SettingsRoutingModule, SharedModule]
})
export class SettingsModule {}
