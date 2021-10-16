import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'organization-list-item',
  templateUrl: './organization-list-item.component.html',
  styleUrls: ['./organization-list-item.component.scss']
})
export class OrganizationListItemComponent implements OnInit {
  @Input() orgLogo: string = 'https://via.placeholder.com/80';
  @Input() orgName: string;
  @Input() isOwner: boolean = false;

  constructor() {}

  ngOnInit() {}
}
