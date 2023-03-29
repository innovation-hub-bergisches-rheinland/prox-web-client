import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-project-card-icon-attribute',
  templateUrl: './project-card-icon-attribute.component.html',
  styleUrls: ['./project-card-icon-attribute.component.scss']
})
export class ProjectCardIconAttributeComponent {
  @Input()
  icon: IconDefinition;

  @Input()
  iconClass = 'text-black';

  @Input()
  tooltip: string;
}
