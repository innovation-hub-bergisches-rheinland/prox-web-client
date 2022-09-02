import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Organization } from '@data/schema/user-service.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';

@Component({
  selector: 'app-organization-editor-dialog',
  templateUrl: './organization-editor-dialog.component.html',
  styleUrls: ['./organization-editor-dialog.component.scss']
})
export class OrganizationEditorDialogComponent implements OnInit {
  constructor(
    public organizationDialogRef: MatDialogRef<OrganizationEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public organization: Organization,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.organizationDialogRef.disableClose = true;
  }

  closeDialog() {
    this.organizationDialogRef.close();
  }

  organizationSaved(org: Organization) {
    this.notificationService.sendToast({
      message: 'Organisation wurde erfolgreich gespeichert',
      type: 'success'
    });
    this.organizationDialogRef.close(org);
  }
}
