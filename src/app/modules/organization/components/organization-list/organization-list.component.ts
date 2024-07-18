import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Organization } from '@data/schema/organization.types';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.scss']
})
export class OrganizationListComponent {
  @Input()
  organizations: Organization[];
  @Output() listChanged = new EventEmitter<void>(); // This is the new event

  onOrganizationChanged() {
    this.listChanged.emit(); // Emit the event upwards when an organization item changes
  }
}
