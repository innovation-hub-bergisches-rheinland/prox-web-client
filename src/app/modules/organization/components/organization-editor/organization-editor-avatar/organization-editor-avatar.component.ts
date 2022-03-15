import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-organization-editor-avatar',
  templateUrl: './organization-editor-avatar.component.html',
  styleUrls: ['./organization-editor-avatar.component.scss']
})
export class OrganizationEditorAvatarComponent implements OnInit {
  @Input()
  organizationAvatarFormGroup: FormGroup;

  imgSrc: string | ArrayBuffer;

  constructor() {}

  ngOnInit(): void {}

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.organizationAvatarFormGroup.patchValue({
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
