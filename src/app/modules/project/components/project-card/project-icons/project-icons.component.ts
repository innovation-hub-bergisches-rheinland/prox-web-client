import { Component, Input, OnInit } from '@angular/core';
import { Context, Specialization, Status } from '@data/schema/project-service.types';

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

  @Input()
  specialization: Specialization[];

  get specializationKeys(): string[] {
    return this.specialization?.map(s => s.key) ?? [];
  }

  constructor() {}

  ngOnInit(): void {}
}
