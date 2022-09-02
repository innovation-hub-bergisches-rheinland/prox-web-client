import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-editor-avatar',
  templateUrl: './profile-editor-avatar.component.html',
  styleUrls: ['./profile-editor-avatar.component.scss']
})
export class ProfileEditorAvatarComponent implements OnInit {
  @Input()
  avatarFormGroup: UntypedFormGroup;

  imgSrc: string | ArrayBuffer;

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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.avatarFormGroup.patchValue({
        avatar: file
      });
      const reader = new FileReader();

      reader.onload = e => {
        this.imgSrc = e.target.result;
      };

      reader.readAsDataURL(file); //Set preview
    }
  }
}
