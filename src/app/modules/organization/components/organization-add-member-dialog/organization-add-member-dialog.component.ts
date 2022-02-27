import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CreateOrganizationMembership,
  Organization,
  OrganizationMembership,
  OrganizationRole,
  UserSearchResult
} from '@data/schema/user-service.types';
import { UserService } from '@data/service/user.service';

interface AddMemberDialogData {
  activeMembers: OrganizationMembership[];
}

@Component({
  selector: 'app-organization-add-member-dialog',
  templateUrl: './organization-add-member-dialog.component.html',
  styleUrls: ['./organization-add-member-dialog.component.scss']
})
export class OrganizationAddMemberDialogComponent implements OnInit {
  activeMemberFilter: (element: UserSearchResult) => boolean = element => !this.data.activeMembers.some(m => m.memberId === element.id);
  addMemberForm = this.fb.group({
    userSearchCtrl: new FormControl('', Validators.required),
    roleSelectCtrl: new FormControl('MEMBER', Validators.required)
  });

  constructor(
    private dialogRef: MatDialogRef<OrganizationAddMemberDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data: AddMemberDialogData
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  addMember() {
    const membership: CreateOrganizationMembership = {
      member: (this.addMemberForm.controls.userSearchCtrl.value as UserSearchResult).id,
      role: this.addMemberForm.controls.roleSelectCtrl.value as OrganizationRole
    };
    this.dialogRef.close(membership);
  }
}
