import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Project } from '@data/schema/openapi/project-service/project';

@Component({
  selector: 'app-project-editor-dialog',
  templateUrl: './project-editor-dialog.component.html',
  styleUrls: ['./project-editor-dialog.component.scss']
})
export class ProjectEditorDialogComponent {
  isDraft: boolean = false;

  constructor(
    public projectDialogRef: MatDialogRef<ProjectEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project
  ) {}

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