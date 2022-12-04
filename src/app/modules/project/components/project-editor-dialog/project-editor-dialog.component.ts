import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Project } from '@data/schema/project.types';

@Component({
  selector: 'app-project-editor-dialog',
  templateUrl: './project-editor-dialog.component.html',
  styleUrls: ['./project-editor-dialog.component.scss']
})
export class ProjectEditorDialogComponent {
  isDraft = false;

  constructor(
    public projectDialogRef: MatDialogRef<ProjectEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project,
    private router: Router
  ) {
    this.projectDialogRef.disableClose = true;
  }

  async projectSaved(event: Project) {
    this.projectDialogRef.close(event);
    await this.router.navigate(['/projects', event.id]);
  }

  closeDialog() {
    this.projectDialogRef.close();
  }

  markDraft(draft: boolean) {
    this.isDraft = draft;
  }
}
