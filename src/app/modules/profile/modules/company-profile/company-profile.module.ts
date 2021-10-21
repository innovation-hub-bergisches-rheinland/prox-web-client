import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileModule } from '@modules/profile/profile.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProfileModule, SharedModule]
})
export class CompanyProfileModule {}
