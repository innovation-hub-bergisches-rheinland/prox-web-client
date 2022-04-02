import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';
import { SashComponent } from './components/sash/sash.component';
import { ProfileAvatarCardComponent } from '@modules/profile/components/profile-avatar-card/profile-avatar-card.component';
import {
  ProfileCardHeaderComponent,
  ProfileCardTitleDirective
} from '@modules/profile/components/profile-card/profile-card-header/profile-card-header.component';
import { ProfileCardComponent, ProfileCardContentDirective } from '@modules/profile/components/profile-card/profile-card.component';
import { ProfileInformationCardComponent } from './components/profile-information-card/profile-information-card.component';
import { ProfileInformationCardEntryComponent } from './components/profile-information-card/profile-information-card-entry/profile-information-card-entry.component';
import { SocialMediaButtonComponent } from './components/social-media-button/social-media-button.component';
import { ProfileFocusSubjectsComponent } from './components/profile-focus-areas/profile-focus-subjects.component';
import { ProfileProjectsCardComponent } from './components/profile-projects-card/profile-projects-card.component';
import { ProfileJobsCardComponent } from './components/profile-jobs-card/profile-jobs-card.component';
import { ProfileProjectHistoryComponent } from './components/profile-project-history/profile-project-history.component';
import { ProfileProjectHistoryItemComponent } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import { LecturerPageComponent } from './pages/lecturer-page/lecturer-page.component';
import { ProfilePublicationsCardComponent } from '@modules/profile/components/profile-publications-card/profile-publications-card.component';
import { ProfileOverviewCardComponent } from '@modules/profile/components/profile-overview-card/profile-overview-card.component';
import { LecturerEditorPageComponent } from './pages/lecturer-editor-page/lecturer-editor-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { LecturerOverviewPageComponent } from './pages/lecturer-overview-page/lecturer-overview-page.component';
import { ProfileProjectCardItemComponent } from './components/profile-projects-card/profile-project-card-item/profile-project-card-item.component';
import { ProfileJobsCardItemComponent } from './components/profile-jobs-card/profile-jobs-card-item/profile-jobs-card-item.component';
import { ProfileAvatarCardTitleDirective } from '@modules/profile/components/profile-avatar-card/profile-avatar-card-title.directive';
import { ProfileAvatarCardSubtitleDirective } from '@modules/profile/components/profile-avatar-card/profile-avatar-card-subtitle.directive';
import { SashContentDirective } from '@modules/profile/components/sash/sash-content.directive';
import { SashTitleDirective } from '@modules/profile/components/sash/sash-title.directive';
import { ProfileSocialMediaCardComponent } from './components/profile-social-media-card/profile-social-media-card.component';
import { ProfileHeaderCardComponent } from './components/profile-header-card/profile-header-card.component';

@NgModule({
  declarations: [
    SashComponent,
    SashContentDirective,
    SashTitleDirective,
    ProfileAvatarCardComponent,
    ProfileCardHeaderComponent,
    ProfileCardTitleDirective,
    ProfileCardContentDirective,
    ProfileCardComponent,
    ProfileInformationCardComponent,
    ProfileInformationCardEntryComponent,
    SocialMediaButtonComponent,
    ProfileFocusSubjectsComponent,
    ProfileProjectsCardComponent,
    ProfileJobsCardComponent,
    ProfileProjectHistoryComponent,
    ProfileProjectHistoryItemComponent,
    LecturerPageComponent,
    ProfilePublicationsCardComponent,
    ProfileOverviewCardComponent,
    LecturerEditorPageComponent,
    OverviewPageComponent,
    LecturerOverviewPageComponent,
    ProfileProjectCardItemComponent,
    ProfileJobsCardItemComponent,
    ProfileAvatarCardTitleDirective,
    ProfileAvatarCardSubtitleDirective,
    ProfileSocialMediaCardComponent,
    ProfileHeaderCardComponent
  ],
  exports: [
    SashComponent,
    SashContentDirective,
    SashTitleDirective,
    ProfileAvatarCardComponent,
    ProfileCardHeaderComponent,
    ProfileCardTitleDirective,
    ProfileCardContentDirective,
    ProfileCardComponent,
    ProfileInformationCardComponent,
    ProfileInformationCardEntryComponent,
    SocialMediaButtonComponent,
    ProfileFocusSubjectsComponent,
    ProfileProjectsCardComponent,
    ProfileJobsCardComponent,
    ProfileProjectHistoryComponent,
    ProfileProjectHistoryItemComponent,
    ProfilePublicationsCardComponent,
    ProfileOverviewCardComponent,
    ProfileProjectCardItemComponent,
    ProfileJobsCardItemComponent,
    ProfileAvatarCardTitleDirective,
    ProfileAvatarCardSubtitleDirective,
    ProfileSocialMediaCardComponent,
    ProfileHeaderCardComponent
  ],
  imports: [CommonModule, ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
