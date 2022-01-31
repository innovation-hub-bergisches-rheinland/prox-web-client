import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-content-page-header',
  templateUrl: './content-page-header.component.html',
  styleUrls: ['./content-page-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentPageHeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
