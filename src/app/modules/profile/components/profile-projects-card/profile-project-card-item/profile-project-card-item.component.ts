import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ModuleType } from '@data/schema/project-service.types';

@Component({
  selector: 'app-profile-project-card-item',
  templateUrl: './profile-project-card-item.component.html',
  styleUrls: ['./profile-project-card-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileProjectCardItemComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  modules: ModuleType[] = [];

  get modulesAsString(): string {
    return `(${this.modules.map(m => m.key).join(' / ')})`;
  }

  @Input()
  id: string;

  constructor() {}

  ngOnInit(): void {}
}
