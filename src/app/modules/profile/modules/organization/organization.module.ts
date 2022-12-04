import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { SharedModule } from '@shared/shared.module';
import { OrganizationItemComponent } from './components/organization-item/organization-item.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { OrganizationOverviewComponent } from './pages/organization-overview/organization-overview.component';
import { OrganizationMembersComponent } from './pages/organization-members/organization-members.component';
import { OrganizationMembershipsListComponent } from './components/organization-memberships-list/organization-memberships-list.component';
import { OrganizationAddMemberDialogComponent } from './components/organization-add-member-dialog/organization-add-member-dialog.component';
import { OrganizationEditMemberDialogComponent } from '@modules/profile/modules/organization/components/organization-edit-member-dialog/organization-edit-member-dialog.component';
import { OrganizationEditorInformationComponent } from './components/organization-editor/organization-editor-information/organization-editor-information.component';
import { OrganizationEditorProfileComponent } from './components/organization-editor/organization-editor-profile/organization-editor-profile.component';
import { OrganizationEditorDialogComponent } from './components/organization-editor-dialog/organization-editor-dialog.component';
import { OrganizationEditorComponent } from './components/organization-editor/organization-editor.component';
import { OrganizationEditorSocialMediaComponent } from './components/organization-editor/organization-editor-social-media/organization-editor-social-media.component';
import { OrganizationProfileComponent } from './pages/organization-profile/organization-profile.component';
import { ProfileModule } from '@modules/profile/profile.module';
import { OrganizationMembershipEntryComponent } from './components/organization-memberships-list/organization-membership-entry/organization-membership-entry.component';

@NgModule({
  declarations: [
    OrganizationEditorComponent,
    OrganizationItemComponent,
    OrganizationListComponent,
    OrganizationOverviewComponent,
    OrganizationMembersComponent,
    OrganizationMembershipsListComponent,
    OrganizationAddMemberDialogComponent,
    OrganizationEditMemberDialogComponent,
    OrganizationEditorInformationComponent,
    OrganizationEditorProfileComponent,
    OrganizationEditorDialogComponent,
    OrganizationEditorSocialMediaComponent,
    OrganizationProfileComponent,
    OrganizationMembershipEntryComponent
  ],
  imports: [CommonModule, SharedModule, OrganizationRoutingModule, ProfileModule]
})
export class OrganizationModule {}
