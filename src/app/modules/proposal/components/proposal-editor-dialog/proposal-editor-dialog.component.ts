import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Proposal } from '@data/schema/project-service.types';

@Component({
  selector: 'app-proposal-editor-dialog',
  templateUrl: './proposal-editor-dialog.component.html'
})
export class ProposalEditorDialogComponent {
  isDraft = false;

  constructor(
    public dialogRef: MatDialogRef<ProposalEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public proposal: Proposal,
    private router: Router
  ) {
    this.dialogRef.disableClose = true;
  }

  async proposalSaved(event: Proposal) {
    this.dialogRef.close(event);
    await this.router.navigate(['/proposals', event.id]);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
