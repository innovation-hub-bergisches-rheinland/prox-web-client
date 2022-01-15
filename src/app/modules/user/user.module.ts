import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UserOrganizationModule } from './modules/organization/organization.module';

import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [UserRoutingModule, UserOrganizationModule, SharedModule],
  exports: [],
  declarations: [],
  providers: []
})
export class UserModule {}
