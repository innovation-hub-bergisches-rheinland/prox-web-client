import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Proposal } from '@data/schema/project-service.types';

@Component({
  selector: 'app-proposal-editor-dialog',
  templateUrl: './proposal-editor-dialog.component.html'
})
export class ProposalEditorDialogComponent {
  isDraft = false;

  constructor(public dialogRef: MatDialogRef<ProposalEditorDialogComponent>, @Inject(MAT_DIALOG_DATA) public proposal: Proposal) {
    this.dialogRef.disableClose = true;
  }

  proposalSaved(event: Proposal) {
    this.dialogRef.close(event);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
