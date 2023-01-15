import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrganizationMembership, OrganizationRole } from '@data/schema/organization.types';

interface EditMemberShipDialogData {
  membership: OrganizationMembership;
}

@Component({
  selector: 'app-organization-edit-member-dialog',
  templateUrl: './organization-edit-member-dialog.component.html',
  styleUrls: ['./organization-edit-member-dialog.component.scss']
})
export class OrganizationEditMemberDialogComponent implements OnInit {
  membership: OrganizationMembership;
  editMemberForm = this.fb.group({
    roleSelectCtrl: new UntypedFormControl('MEMBER', Validators.required)
  });

  constructor(
    private dialogRef: MatDialogRef<OrganizationEditMemberDialogComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: EditMemberShipDialogData
  ) {
    this.membership = data.membership;
  }

  ngOnInit(): void {
    this.editMemberForm.controls.roleSelectCtrl.setValue(this.membership.role);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateMember() {
    const membership: OrganizationMembership = {
      ...this.membership,
      role: this.editMemberForm.controls.roleSelectCtrl.value as OrganizationRole
    };
    this.dialogRef.close(membership);
  }
}
