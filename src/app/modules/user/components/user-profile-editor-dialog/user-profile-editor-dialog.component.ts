import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserProfile } from '@data/schema/user-service.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';

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
    @Inject(MAT_DIALOG_DATA) public userProfile: UserProfileEditorInput,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.organizationDialogRef.disableClose = true;
  }

  closeDialog() {
    this.organizationDialogRef.close();
  }

  userProfileSaved(profile: UserProfile) {
    this.notificationService.showToast({
      message: 'Benutzerprofil wurde erfolgreich gespeichert'
    });
    this.organizationDialogRef.close(profile);
  }
}
