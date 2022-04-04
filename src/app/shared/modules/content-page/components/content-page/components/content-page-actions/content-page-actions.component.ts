import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-content-page-actions',
  templateUrl: './content-page-actions.component.html',
  styleUrls: ['./content-page-actions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentPageActionsComponent {}
