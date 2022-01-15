import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { OrganizationListItemComponent } from './components/organization-list-item/organization-list-item.component';
import { UserOrganizationsComponent } from './page/organizations/organizations.component';

@NgModule({
  imports: [SharedModule],
  exports: [],
  declarations: [OrganizationListItemComponent, UserOrganizationsComponent],
  providers: []
})
export class UserOrganizationModule {}
