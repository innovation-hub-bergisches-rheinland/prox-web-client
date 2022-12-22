import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Lecturer } from '@data/schema/profile.types';

export interface UserProfileEditorInput {
  profile: Lecturer;
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

  userProfileSaved(profile: Lecturer) {
    this.organizationDialogRef.close(profile);
  }
}
