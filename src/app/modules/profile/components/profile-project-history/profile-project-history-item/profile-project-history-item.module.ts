import { NgModule } from '@angular/core';
import { ProfileInformationCardComponent } from '@modules/profile/components/profile-information-card/profile-information-card.component';
import { CommonModule } from '@angular/common';
import { ProfileInformationCardEntryModule } from '@modules/profile/components/profile-information-card/profile-information-card-entry/profile-information-card-entry.module';
import { ProfileProjectHistoryItemComponent } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';

@NgModule({
  declarations: [ProfileProjectHistoryItemComponent],
  imports: [CommonModule]
})
export class ProfileProjectHistoryItemModule {}
