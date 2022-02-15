import { Component, Input, OnInit } from '@angular/core';
import { Organization } from '@data/schema/user-service.types';

@Component({
  selector: 'app-organization-item',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.scss']
})
export class OrganizationItemComponent implements OnInit {
  @Input()
  organization: Organization;

  constructor() {}

  ngOnInit(): void {}
}
