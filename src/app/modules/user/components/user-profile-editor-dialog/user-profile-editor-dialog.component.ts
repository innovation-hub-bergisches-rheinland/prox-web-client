import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from '@data/schema/user-service.types';

export interface UserProfileEditorInput {
  id: string;
  profile: UserProfile;
}

@Component({
  selector: 'app-user-profile-editor-dialog',
  templateUrl: './user-profile-editor-dialog.component.html',
  styleUrls: ['./user-profile-editor-dialog.component.scss']
})
export class UserProfileEditorDialogComponent implements OnInit {
  constructor(
    public organizationDialogRef: MatDialogRef<UserProfileEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userProfile: UserProfileEditorInput
  ) {}

  ngOnInit(): void {
    this.organizationDialogRef.disableClose = true;
  }

  closeDialog() {
    this.organizationDialogRef.close();
  }

  userProfileSaved(profile: UserProfile) {
    this.organizationDialogRef.close(profile);
  }
}
