import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ContactRoutingModule } from './contact-routing.module';
import { ContactComponent } from './pages/contact/contact.component';
import { ContactCardComponent } from './components/contact-card/contact-card.component';

@NgModule({
  declarations: [ContactComponent, ContactCardComponent],
  imports: [SharedModule, ContactRoutingModule]
})
export class ContactModule {}
