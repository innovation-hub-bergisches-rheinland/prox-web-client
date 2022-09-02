import { Component } from '@angular/core';
import { Contact } from '@modules/contact/contact.types';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contacts: Contact[] = [
    {
      title: 'Professor',
      name: 'Stefan Bente',
      email: 'stefan.bente@th-koeln.de',
      image: '/assets/images/contact/bente.bmp'
    },
    {
      title: 'Koordinator IT-Lab',
      name: 'Julian Lengelsen',
      email: 'julian.lengelsen@innovation-hub.de',
      image: '/assets/images/contact/lengelsen.jpg'
    },
    {
      title: 'Wissenschaftlicher Mitarbeiter',
      name: 'Tobias Hund',
      email: 'tobias.hund@innovation-hub.de',
      image: '/assets/images/contact/thund.jpg'
    }
  ];
}
