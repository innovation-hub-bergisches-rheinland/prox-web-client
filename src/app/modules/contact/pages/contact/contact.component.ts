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
      image: '/assets/images/contact/bente.bmp'
    },
    {
      title: 'Wissenschaftlicher Mitarbeiter',
      name: 'Jannik Alexander',
      image: '/assets/images/contact/jalexan.jpg'
    }
  ];
}
