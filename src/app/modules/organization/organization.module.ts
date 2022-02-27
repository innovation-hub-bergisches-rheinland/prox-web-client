import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { SharedModule } from '@shared/shared.module';
import { OrganizationEditorComponent } from './pages/organization-editor/organization-editor.component';
import { OrganizationItemComponent } from './components/organization-item/organization-item.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { OrganizationOverviewComponent } from './pages/organization-overview/organization-overview.component';
import { OrganizationMembersComponent } from './pages/organization-members/organization-members.component';
import { OrganizationMembershipsListComponent } from './components/organization-memberships-list/organization-memberships-list.component';
import { OrganizationAddMemberDialogComponent } from './components/organization-add-member-dialog/organization-add-member-dialog.component';
import { OrganizationEditMemberDialogComponent } from '@modules/organization/components/organization-edit-member-dialog/organization-edit-member-dialog.component';

@NgModule({
  declarations: [
    OrganizationEditorComponent,
    OrganizationItemComponent,
    OrganizationListComponent,
    OrganizationOverviewComponent,
    OrganizationMembersComponent,
    OrganizationMembershipsListComponent,
    OrganizationAddMemberDialogComponent,
    OrganizationEditMemberDialogComponent
  ],
  imports: [CommonModule, SharedModule, OrganizationRoutingModule]
})
export class OrganizationModule {}
