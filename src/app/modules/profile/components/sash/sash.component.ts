import { ChangeDetectionStrategy, Component, Directive, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';

@Directive({
  selector: 'app-sash-content'
})
export class SashContentDirective {
  @HostBinding('class') classes = 'app-sash-content';

  constructor() {}
}

@Directive({
  selector: 'app-sash-title'
})
export class SashTitleDirective {
  @HostBinding('class') classes = 'app-sash-title';

  constructor() {}
}

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
