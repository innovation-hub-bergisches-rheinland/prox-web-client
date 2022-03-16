import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sash',
  templateUrl: './sash.component.html',
  styleUrls: ['./sash.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SashComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
