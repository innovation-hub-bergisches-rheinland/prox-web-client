import { Component, Input, OnInit } from '@angular/core';
import { Organization } from '@data/schema/user-service.types';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent implements OnInit {
  @Input()
  organizations: Organization[];

  constructor() {}

  ngOnInit(): void {}
}
