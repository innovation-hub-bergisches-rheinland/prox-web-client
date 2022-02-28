import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-editor-tag',
  templateUrl: './project-editor-tag.component.html',
  styleUrls: ['./project-editor-tag.component.scss']
})
export class ProjectEditorTagComponent implements OnInit {
  @Input()
  tagFormGroup: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
