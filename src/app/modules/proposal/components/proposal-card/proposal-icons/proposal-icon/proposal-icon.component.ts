import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-proposal-icon',
  templateUrl: './proposal-icon.component.html'
})
export class ProposalIconComponent implements OnInit {
  @Input()
  icon: IconDefinition;

  @Input()
  tooltip: string;

  constructor() {}

  ngOnInit(): void {}
}
