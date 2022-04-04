import { Component, Input, OnInit } from '@angular/core';
import { faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-publications-card',
  templateUrl: './profile-publications-card.component.html',
  styleUrls: ['./profile-publications-card.component.scss']
})
export class ProfilePublicationsCardComponent {
  icon = faBook;

  @Input()
  publications: string[];

  limit = 10;
}
