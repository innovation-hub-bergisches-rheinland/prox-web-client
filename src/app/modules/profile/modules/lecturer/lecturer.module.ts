import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LecturerRoutingModule } from './lecturer-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { LecturerProfilePageComponent } from './pages/lecturer-profile-page/lecturer-profile-page.component';
import { LecturerProfileEditorDialogComponent } from '@modules/profile/modules/lecturer/components/lecturer-profile-editor-dialog/lecturer-profile-editor-dialog.component';
import { LecturerProfileEditorComponent } from '@modules/profile/modules/lecturer/components/lecturer-profile-editor/lecturer-profile-editor.component';
import { LecturerProfileEditorInformationComponent } from './components/lecturer-profile-editor/lecturer-profile-editor-information/lecturer-profile-editor-information.component';
import { LecturerProfileEditorAdditionalInformationComponent } from '@modules/profile/modules/lecturer/components/lecturer-profile-editor/lecturer-profile-editor-additional-information/lecturer-profile-editor-additional-information.component';
import { LecturerProfileEditorPublicationsComponent } from '@modules/profile/modules/lecturer/components/lecturer-profile-editor/lecturer-profile-editor-publications/lecturer-profile-editor-publications.component';
import { LecturerProfileOverviewPageComponent } from './pages/lecturer-profile-overview-page/lecturer-profile-overview-page.component';
import { LecturerItemComponent } from '@modules/profile/modules/lecturer/components/lecturer-item/lecturer-item.component';

@NgModule({
  declarations: [
    LecturerProfilePageComponent,
    LecturerProfileEditorDialogComponent,
    LecturerProfileEditorComponent,
    LecturerProfileEditorInformationComponent,
    LecturerProfileEditorAdditionalInformationComponent,
    LecturerProfileEditorPublicationsComponent,
    LecturerProfileOverviewPageComponent,
    LecturerItemComponent
  ],
  imports: [CommonModule, SharedModule, LecturerRoutingModule, ProfileModule]
})
export class LecturerModule {}
