import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tag } from '@data/schema/tag.types';

export interface TagSplitDialogData {
  tagToSplit: Tag;
}

export interface TagSplitDialogResult {
  tagToSplit: Tag;
  splitted: string[];
}

@Component({
  selector: 'app-tag-split-dialog',
  templateUrl: './tag-split-dialog.component.html'
})
export class TagSplitDialogComponent {
  splitCtrl = new FormControl<string[]>([]);

  constructor(private dialogRef: MatDialogRef<TagSplitDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: TagSplitDialogData) {}

  close() {
    this.dialogRef.close({
      tagToSplit: this.data.tagToSplit,
      splitted: this.splitCtrl.value
    } satisfies TagSplitDialogResult);
  }
}
