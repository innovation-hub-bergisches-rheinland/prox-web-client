import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Tag, UpdateTagRequest } from '@data/schema/tag.types';

export interface TagUpdateDialogData {
  tag: Tag;
}

export interface TagEditResult {
  tag: Tag;
  updatedTag: UpdateTagRequest;
}

@Component({
  selector: 'app-tag-edit-dialog',
  templateUrl: './tag-edit-dialog.component.html'
})
export class TagEditDialogComponent {
  tagSelectCtrl = new FormControl<Tag>(null);
  formGroup = this.fb.group({
    tagName: [this.data.tag.tagName, Validators.compose([Validators.required, Validators.minLength(3)])],
    aliases: [this.data.tag.aliases]
  });

  constructor(
    private dialogRef: MatDialogRef<TagEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TagUpdateDialogData,
    private fb: FormBuilder
  ) {}

  close() {
    this.dialogRef.close({
      tag: this.data.tag,
      updatedTag: {
        aliases: this.formGroup.get('aliases').value,
        tagName: this.formGroup.get('tagName').value
      }
    } satisfies TagEditResult);
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const ctrl = this.formGroup.get('aliases');
    const ctrlValue = ctrl.value;

    if (value && ctrlValue.indexOf(value) === -1) {
      ctrl.setValue([...ctrlValue, value]);
    }

    event.chipInput.clear();
  }

  remove(alias: string): void {
    const ctrl = this.formGroup.get('aliases');
    const ctrlValue = ctrl.value;

    if (alias && ctrlValue.indexOf(alias) > -1) {
      ctrl.setValue(ctrlValue.filter(a => a !== alias));
    }
  }
}
