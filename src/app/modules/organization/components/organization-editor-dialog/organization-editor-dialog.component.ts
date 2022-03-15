import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-organization-editor-dialog',
  templateUrl: './organization-editor-dialog.component.html',
  styleUrls: ['./organization-editor-dialog.component.scss']
})
export class OrganizationEditorDialogComponent implements OnInit {
  constructor(public organizationDialogRef: MatDialogRef<OrganizationEditorDialogComponent>) {}

  ngOnInit(): void {
    this.organizationDialogRef.disableClose = true;
  }

  closeDialog() {
    this.organizationDialogRef.close();
  }
}
