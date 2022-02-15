import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { SharedModule } from '@shared/shared.module';
import { OrganizationEditorComponent } from './pages/organization-editor/organization-editor.component';
import { OrganizationItemComponent } from './components/organization-item/organization-item.component';
import { OrganizationListComponent } from './components/organization-list/organization-list.component';
import { OrganizationOverviewComponent } from './pages/organization-overview/organization-overview.component';

@NgModule({
  declarations: [OrganizationEditorComponent, OrganizationItemComponent, OrganizationListComponent, OrganizationOverviewComponent],
  imports: [CommonModule, SharedModule, OrganizationRoutingModule]
})
export class OrganizationModule {}
