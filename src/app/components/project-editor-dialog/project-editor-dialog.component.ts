import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Project } from '@prox/shared/hal-resources';

@Component({
  selector: 'app-project-editor-dialog',
  templateUrl: './project-editor-dialog.component.html',
  styleUrls: ['./project-editor-dialog.component.scss']
})
export class ProjectEditorDialogComponent implements OnInit {
  constructor(
    public projectDialogRef: MatDialogRef<ProjectEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project
  ) {}

  ngOnInit() {}

  projectSaved() {
    this.projectDialogRef.close();
  }
}
