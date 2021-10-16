import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
import { SharedModule } from '@shared/shared.module';
import { OrganizationEditorComponent } from './pages/organization-editor/organization-editor.component';

@NgModule({
  declarations: [OrganizationEditorComponent],
  imports: [CommonModule, SharedModule, OrganizationRoutingModule]
})
export class OrganizationModule {}
