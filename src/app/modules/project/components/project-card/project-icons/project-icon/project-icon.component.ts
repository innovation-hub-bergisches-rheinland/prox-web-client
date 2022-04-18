import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-project-icon',
  templateUrl: './project-icon.component.html',
  styleUrls: ['./project-icon.component.scss']
})
export class ProjectIconComponent implements OnInit {
  @Input()
  icon: IconDefinition;

  constructor() {}

  ngOnInit(): void {}
}
