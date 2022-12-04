import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddOrganizationMembershipRequest, OrganizationMembership, OrganizationRole } from '@data/schema/profile.types';
import { User } from '@data/schema/user.types';

interface AddMemberDialogData {
  activeMembers: OrganizationMembership[];
}

@Component({
  selector: 'app-organization-add-member-dialog',
  templateUrl: './organization-add-member-dialog.component.html',
  styleUrls: ['./organization-add-member-dialog.component.scss']
})
export class OrganizationAddMemberDialogComponent {
  addMemberForm = this.fb.group({
    userSearchCtrl: new UntypedFormControl('', Validators.required),
    roleSelectCtrl: new UntypedFormControl('MEMBER', Validators.required)
  });

  constructor(
    private dialogRef: MatDialogRef<OrganizationAddMemberDialogComponent>,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: AddMemberDialogData
  ) {}

  activeMemberFilter: (element: User) => boolean = element => !this.data.activeMembers.some(m => m.member === element.id);

  closeDialog() {
    this.dialogRef.close();
  }

  addMember() {
    const membership: AddOrganizationMembershipRequest = {
      member: (this.addMemberForm.controls.userSearchCtrl.value as User).id,
      role: this.addMemberForm.controls.roleSelectCtrl.value as OrganizationRole
    };
    this.dialogRef.close(membership);
  }
}
