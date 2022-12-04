import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';

export interface TagFormGroup {
  tags: FormControl<string[]>;
}

@Component({
  selector: 'app-project-editor-tag',
  templateUrl: './project-editor-tag.component.html',
  styleUrls: ['./project-editor-tag.component.scss']
})
export class ProjectEditorTagComponent {
  @Input()
  tagFormGroup: FormGroup<TagFormGroup>;
}
