import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from '@data/schema/project-service.types';

@Component({
  selector: 'app-project-editor-dialog',
  templateUrl: './project-editor-dialog.component.html',
  styleUrls: ['./project-editor-dialog.component.scss']
})
export class ProjectEditorDialogComponent {
  isDraft = false;

  constructor(public projectDialogRef: MatDialogRef<ProjectEditorDialogComponent>, @Inject(MAT_DIALOG_DATA) public project: Project) {
    this.projectDialogRef.disableClose = true;
  }

  projectSaved(event: Project) {
    this.projectDialogRef.close(event);
  }

  closeDialog() {
    this.projectDialogRef.close();
  }

  markDraft(draft: boolean) {
    this.isDraft = draft;
  }
}
