import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ProfileEditorAvatarComponent } from './components/profile-editor-avatar/profile-editor-avatar.component';
import { ProfileEditorGeneralComponent } from './components/profile-editor-general/profile-editor-general.component';
import { ProfileEditorLecturerComponent } from './components/profile-editor-lecturer/profile-editor-lecturer.component';
import { ProfileEditorPublicationsComponent } from './components/profile-editor-publications/profile-editor-publications.component';
import { ProfileEditorComponent } from './pages/profile-editor/profile-editor.component';

@NgModule({
  declarations: [
    ProfileEditorAvatarComponent,
    ProfileEditorGeneralComponent,
    ProfileEditorLecturerComponent,
    ProfileEditorPublicationsComponent,
    ProfileEditorComponent
  ],
  imports: [CommonModule, SettingsRoutingModule, SharedModule]
})
export class SettingsModule {}
