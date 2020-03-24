import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './page/contact/contact.component';

@NgModule({
  declarations: [ContactComponent],
  imports: [SharedModule, ContactRoutingModule]
})
export class ContactModule {}
