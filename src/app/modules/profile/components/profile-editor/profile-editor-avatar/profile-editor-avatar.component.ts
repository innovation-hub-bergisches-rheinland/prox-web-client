import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-profile-editor-avatar',
  templateUrl: './profile-editor-avatar.component.html',
  styleUrls: ['./profile-editor-avatar.component.scss']
})
export class ProfileEditorAvatarComponent implements OnInit {
  @Input()
  avatarFormGroup: FormGroup<{ avatar: FormControl<File | null> }>;

  imgSrc: string | File | ArrayBuffer;

  constructor(private matDialog: MatDialog) {}

  ngOnInit(): void {
    const avatarFormControl = this.avatarFormGroup.controls['avatar'];
    if (avatarFormControl.value) {
      this.imgSrc = avatarFormControl.value;
    }
    this.avatarFormGroup.controls['avatar'].valueChanges.subscribe({
      next: value => {
        this.imgSrc = value;
      }
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.files.length > 0) {
      const file = target.files[0];
      this.avatarFormGroup.patchValue({
        avatar: file
      });
      this.avatarFormGroup.markAsDirty();
      const reader = new FileReader();

      reader.onload = e => {
        this.imgSrc = e.target.result;
      };

      reader.readAsDataURL(file); //Set preview
    }
  }

  onDelete() {
    const dialog = this.matDialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Avatar entfernen?',
        message: 'Möchten Sie Ihren Avatar wirklich entfernen?'
      }
    });
    dialog.afterClosed().subscribe({
      next: value => {
        if (value === true) {
          this.resetAvatar();
        }
      }
    });
  }

  private resetAvatar() {
    this.imgSrc = '/assets/images/blank-profile-picture.png';
    this.avatarFormGroup.controls.avatar.setValue(null);
    this.avatarFormGroup.markAsDirty();
  }
}
