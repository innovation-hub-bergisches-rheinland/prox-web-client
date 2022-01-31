import { Component, Input, OnInit } from '@angular/core';
import { Context, Status } from '@data/schema/project-service.types';

@Component({
  selector: 'app-project-icons',
  templateUrl: './project-icons.component.html',
  styleUrls: ['./project-icons.component.scss']
})
export class ProjectIconsComponent implements OnInit {
  @Input()
  status: Status;

  @Input()
  context: Context;

  constructor() {}

  ngOnInit(): void {}
}
