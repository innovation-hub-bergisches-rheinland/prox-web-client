import { Component, Input } from '@angular/core';
import { Organization } from '@data/schema/user-service.types';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent {
  @Input()
  organizations: Organization[];
}
