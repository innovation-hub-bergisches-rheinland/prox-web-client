import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';
import { CompanyInformationComponent } from './components/company-information/company-information.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile/company-profile.component';
import { CompanyVitaComponent } from './components/company-vita/company-vita.component';

@NgModule({
  declarations: [
    CompanyInformationComponent,
    CompanyProfileComponent,
    CompanyVitaComponent
  ],
  imports: [SharedModule, CompanyProfileRoutingModule, FlexLayoutModule],
  entryComponents: []
})
export class CompanyProfileModule {}
