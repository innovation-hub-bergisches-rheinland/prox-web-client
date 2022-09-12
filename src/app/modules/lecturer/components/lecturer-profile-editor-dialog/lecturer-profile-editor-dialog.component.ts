import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from '@data/schema/user-service.types';

export interface UserProfileEditorInput {
  id: string;
  profile: UserProfile;
}

@Component({
  selector: 'app-lecturer-profile-editor-dialog',
  templateUrl: './lecturer-profile-editor-dialog.component.html',
  styleUrls: ['./lecturer-profile-editor-dialog.component.scss']
})
export class LecturerProfileEditorDialogComponent implements OnInit {
  constructor(
    public organizationDialogRef: MatDialogRef<LecturerProfileEditorDialogComponent>,
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
