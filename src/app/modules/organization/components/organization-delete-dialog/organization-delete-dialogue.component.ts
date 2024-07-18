import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Organization } from '@data/schema/organization.types';

@Component({
  selector: 'app-delete-organization-dialog',
  templateUrl: './organization-delete-dialogue.component.html',
  styleUrls: ['./delete-organization-dialog.component.scss']
})
export class OrganizationDeleteDialogueComponent implements OnInit {
  organizationName: string;
  constructor(
    public organizationDialogRef: MatDialogRef<OrganizationDeleteDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public orgName: string
  ) {}

  ngOnInit() {
    this.organizationName = this.orgName;
  }

  onNoClick(): void {
    this.organizationDialogRef.close(false);
  }

  onYesClick(): void {
    this.organizationDialogRef.close(true);
  }
}
