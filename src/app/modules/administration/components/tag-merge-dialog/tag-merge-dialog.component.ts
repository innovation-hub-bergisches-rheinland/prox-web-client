import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tag } from '@data/schema/tag.types';

export interface TagMergeDialogData {
  tagToMerge: Tag;
}

export interface TagMergeDialogResult {
  tagToMerge: Tag;
  targetTag: Tag;
}

@Component({
  selector: 'app-tag-merge-dialog',
  templateUrl: './tag-merge-dialog.component.html'
})
export class TagMergeDialogComponent {
  tagSelectCtrl = new FormControl<Tag>(null);

  constructor(private dialogRef: MatDialogRef<TagMergeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TagMergeDialogData) {}

  close() {
    this.dialogRef.close({
      tagToMerge: this.data.tagToMerge,
      targetTag: this.tagSelectCtrl.value
    } satisfies TagMergeDialogResult);
  }
}
