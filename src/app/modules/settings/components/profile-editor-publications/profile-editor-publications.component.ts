import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-editor-publications',
  templateUrl: './profile-editor-publications.component.html'
})
export class ProfileEditorPublicationsComponent {
  @Input()
  publicationFormControl: FormControl<string[]>;

  publicationInput = new FormControl<string>('', Validators.compose([Validators.minLength(1), Validators.maxLength(1023)]));

  addPublication(pub: string) {
    this.publicationFormControl.value.push(pub);
    this.publicationInput.setValue('');
  }

  removePublication(idx: number) {
    this.publicationFormControl.value.splice(idx, 1);
  }
}
