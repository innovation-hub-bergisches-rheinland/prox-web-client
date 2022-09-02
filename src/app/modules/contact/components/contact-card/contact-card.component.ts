import { Component, Input, OnInit } from '@angular/core';
import { Contact } from '@modules/contact/contact.types';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.scss']
})
export class ContactCardComponent implements OnInit {
  @Input()
  contact: Contact;

  @Input()
  imageSrc: string;

  constructor() {}

  ngOnInit(): void {}
}
