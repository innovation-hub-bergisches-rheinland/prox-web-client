import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-project-editor-information',
  templateUrl: './project-editor-information.component.html',
  styleUrls: ['./project-editor-information.component.scss']
})
export class ProjectEditorInformationComponent {
  @Input()
  informationFormGroup: FormGroup;
}
