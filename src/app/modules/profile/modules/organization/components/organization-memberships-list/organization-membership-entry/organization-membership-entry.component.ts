import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPen, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-organization-membership-entry',
  templateUrl: './organization-membership-entry.component.html',
  styleUrls: ['./organization-membership-entry.component.scss']
})
export class OrganizationMembershipEntryComponent implements OnInit {
  personIcon = faUser;
  deleteIcon = faTrash;
  editIcon = faPen;

  @Input()
  name: string;

  @Input()
  showRemove = false;

  @Input()
  showEdit = false;

  @Output()
  remove = new EventEmitter<MouseEvent>();

  @Output()
  edit = new EventEmitter<MouseEvent>();

  constructor() {}

  ngOnInit(): void {}
}
