import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Organization } from '@data/schema/user-service.types';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-organization-editor-dialog',
  templateUrl: './organization-editor-dialog.component.html',
  styleUrls: ['./organization-editor-dialog.component.scss']
})
export class OrganizationEditorDialogComponent implements OnInit {
  constructor(
    public organizationDialogRef: MatDialogRef<OrganizationEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public organization: Organization,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.organizationDialogRef.disableClose = true;
  }

  closeDialog() {
    this.organizationDialogRef.close();
  }

  organizationSaved(org: Organization) {
    this.toastService.showToast({
      message: 'Organisation wurde erfolgreich gespeichert'
    });
    this.organizationDialogRef.close(org);
  }
}
