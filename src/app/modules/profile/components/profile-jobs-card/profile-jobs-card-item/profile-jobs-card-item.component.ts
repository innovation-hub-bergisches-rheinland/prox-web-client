import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-profile-jobs-card-item',
  templateUrl: './profile-jobs-card-item.component.html',
  styleUrls: ['./profile-jobs-card-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileJobsCardItemComponent implements OnInit {
  @Input()
  title: string;

  @Input()
  levels: string[] = [];

  get levelsAsString(): string {
    return `(${this.levels.join(' / ')})`;
  }

  @Input()
  id: string;

  constructor() {}

  ngOnInit(): void {}
}
