import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-status-icon',
  templateUrl: './status-icon.component.html'
})
export class StatusIconComponent implements OnInit {
  @Input()
  tooltip: string;

  @Input()
  icon: IconDefinition;

  constructor() {}
  ngOnInit() {}
}
