import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-organization-editor-information',
  templateUrl: './organization-editor-information.component.html',
  styleUrls: ['./organization-editor-information.component.scss']
})
export class OrganizationEditorInformationComponent implements OnInit {
  @Input()
  organizationInformationForm: FormGroup;

  constructor() {}

  ngOnInit(): void {}
}
