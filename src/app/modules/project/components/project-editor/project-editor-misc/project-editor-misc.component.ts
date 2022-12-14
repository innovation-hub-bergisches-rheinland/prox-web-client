import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Moment } from 'moment';

export interface MiscFormGroup {
  tags: FormControl<string[]>;
  beginDate: FormControl<Moment | null>;
  endDate: FormControl<Moment | null>;
}

@Component({
  selector: 'app-project-editor-misc',
  templateUrl: './project-editor-misc.component.html',
  styleUrls: ['./project-editor-misc.component.scss']
})
export class ProjectEditorMiscComponent {
  @Input()
  miscFormGroup: FormGroup<MiscFormGroup>;
}
