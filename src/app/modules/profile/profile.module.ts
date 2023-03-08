import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { ProfileTagsComponent } from './components/profile-tags/profile-tags.component';
import { ProfileProjectsCardComponent } from './components/profile-projects-card/profile-projects-card.component';
import { ProfileProjectHistoryComponent } from './components/profile-project-history/profile-project-history.component';
import { ProfileProjectHistoryItemComponent } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import { ProfilePublicationsCardComponent } from '@modules/profile/components/profile-publications-card/profile-publications-card.component';
import { ProfileProjectCardItemComponent } from './components/profile-projects-card/profile-project-card-item/profile-project-card-item.component';
import { ProfileAvatarCardTitleDirective } from '@modules/profile/components/profile-avatar-card/profile-avatar-card-title.directive';
import { ProfileAvatarCardSubtitleDirective } from '@modules/profile/components/profile-avatar-card/profile-avatar-card-subtitle.directive';
import { SashContentDirective } from '@modules/profile/components/sash/sash-content.directive';
import { SashTitleDirective } from '@modules/profile/components/sash/sash-title.directive';
import { ProfileSocialMediaCardComponent } from './components/profile-social-media-card/profile-social-media-card.component';
import { ProfileHeaderCardComponent } from './components/profile-header-card/profile-header-card.component';
import { ProfileSearchPanelComponent } from './components/profile-search-panel/profile-search-panel.component';
import { ProfileRoutingModule } from './profile-routing.module';

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
    ProfileTagsComponent,
    ProfileProjectsCardComponent,
    ProfileProjectHistoryComponent,
    ProfileProjectHistoryItemComponent,
    ProfilePublicationsCardComponent,
    ProfileProjectCardItemComponent,
    ProfileAvatarCardTitleDirective,
    ProfileAvatarCardSubtitleDirective,
    ProfileSocialMediaCardComponent,
    ProfileHeaderCardComponent,
    ProfileSearchPanelComponent
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
    ProfileTagsComponent,
    ProfileProjectsCardComponent,
    ProfileProjectHistoryComponent,
    ProfileProjectHistoryItemComponent,
    ProfilePublicationsCardComponent,
    ProfileProjectCardItemComponent,
    ProfileAvatarCardTitleDirective,
    ProfileAvatarCardSubtitleDirective,
    ProfileSocialMediaCardComponent,
    ProfileHeaderCardComponent,
    ProfileSearchPanelComponent
  ],
  imports: [CommonModule, SharedModule, ProfileRoutingModule]
})
export class ProfileModule {}
