import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { UserProfilePageComponent } from './pages/user-profile-page/user-profile-page.component';
import { UserProfileEditorDialogComponent } from '@modules/user/components/user-profile-editor-dialog/user-profile-editor-dialog.component';
import { UserProfileEditorComponent } from '@modules/user/components/user-profile-editor/user-profile-editor.component';
import { UserProfileEditorInformationComponent } from './components/user-profile-editor/user-profile-editor-information/user-profile-editor-information.component';
import { UserProfileEditorAdditionalInformationComponent } from '@modules/user/components/user-profile-editor/user-profile-editor-additional-information/user-profile-editor-additional-information.component';

@NgModule({
  declarations: [
    UserProfilePageComponent,
    UserProfileEditorDialogComponent,
    UserProfileEditorComponent,
    UserProfileEditorInformationComponent,
    UserProfileEditorAdditionalInformationComponent
  ],
  imports: [CommonModule, SharedModule, UserRoutingModule, ProfileModule]
})
export class UserModule {}
