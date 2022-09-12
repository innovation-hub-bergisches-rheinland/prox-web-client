import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LecturerRoutingModule } from './lecturer-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { LecturerProfilePageComponent } from './pages/lecturer-profile-page/lecturer-profile-page.component';
import { LecturerProfileEditorDialogComponent } from '@modules/Lecturer/components/Lecturer-profile-editor-dialog/Lecturer-profile-editor-dialog.component';
import { LecturerProfileEditorComponent } from '@modules/Lecturer/components/Lecturer-profile-editor/Lecturer-profile-editor.component';
import { LecturerProfileEditorInformationComponent } from './components/lecturer-profile-editor/lecturer-profile-editor-information/lecturer-profile-editor-information.component';
import { LecturerProfileEditorAdditionalInformationComponent } from '@modules/Lecturer/components/Lecturer-profile-editor/Lecturer-profile-editor-additional-information/Lecturer-profile-editor-additional-information.component';
import { LecturerProfileEditorPublicationsComponent } from '@modules/Lecturer/components/Lecturer-profile-editor/Lecturer-profile-editor-publications/Lecturer-profile-editor-publications.component';
import { LecturerProfileOverviewPageComponent } from './pages/lecturer-profile-overview-page/lecturer-profile-overview-page.component';
import { LecturerItemComponent } from '@modules/Lecturer/components/Lecturer-item/Lecturer-item.component';

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
