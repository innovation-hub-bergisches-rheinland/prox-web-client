import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '@shared/shared.module';
import {
  SashComponent,
  SashContentDirective,
  SashTitleDirective
} from './components/sash/sash.component';
import { ProfileAvatarCardComponent } from '@modules/profile/components/profile-avatar-card/profile-avatar-card.component';
import {
  ProfileCardHeaderComponent,
  ProfileCardTitleDirective
} from '@modules/profile/components/profile-card/profile-card-header/profile-card-header.component';
import {
  ProfileCardComponent,
  ProfileCardContentDirective
} from '@modules/profile/components/profile-card/profile-card.component';
import { OrganizationPageComponent } from './pages/organization-page/organization-page.component';
import { ProfileInformationCardComponent } from './components/profile-information-card/profile-information-card.component';
import { ProfileInformationCardEntryComponent } from './components/profile-information-card/profile-information-card-entry/profile-information-card-entry.component';
import { ProfileLanguageCardComponent } from '@modules/profile/components/profile-language-card/profile-language-card.component';
import { ProfileLanguageCardEntryComponent } from '@modules/profile/components/profile-language-card/language-entry/profile-language-card-entry.component';
import { SocialMediaButtonComponent } from './components/social-media-button/social-media-button.component';
import { ProfileFocusSubjectsComponent } from './components/profile-focus-areas/profile-focus-subjects.component';
import { ProfileCarouselComponent } from '@modules/profile/components/profile-carousel/profile-carousel.component';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { ProfileProjectsCardComponent } from './components/profile-projects-card/profile-projects-card.component';
import { ProfileJobsCardComponent } from './components/profile-jobs-card/profile-jobs-card.component';
import { ProfileProjectHistoryComponent } from './components/profile-project-history/profile-project-history.component';
import { ProfileProjectHistoryItemComponent } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LecturerPageComponent } from './pages/lecturer-page/lecturer-page.component';
import { ProfilePublicationsCardComponent } from '@modules/profile/components/profile-publications-card/profile-publications-card.component';
import { ProfileOverviewCardComponent } from '@modules/profile/components/profile-overview-card/profile-overview-card.component';

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
    OrganizationPageComponent,
    ProfileInformationCardComponent,
    ProfileInformationCardEntryComponent,
    ProfileLanguageCardComponent,
    ProfileLanguageCardEntryComponent,
    SocialMediaButtonComponent,
    ProfileFocusSubjectsComponent,
    ProfileCarouselComponent,
    ProfileProjectsCardComponent,
    ProfileJobsCardComponent,
    ProfileProjectHistoryComponent,
    ProfileProjectHistoryItemComponent,
    ProfilePageComponent,
    LecturerPageComponent,
    ProfilePublicationsCardComponent,
    ProfileOverviewCardComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    MatCarouselModule.forRoot()
  ]
})
export class ProfileModule {}
