import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-editor-tag',
  templateUrl: './project-editor-tag.component.html',
  styleUrls: ['./project-editor-tag.component.scss']
})
export class ProjectEditorTagComponent {
  @Input()
  tagFormGroup: UntypedFormGroup;
}
