import { Component, Input, OnInit } from '@angular/core';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html'
})
export class BannerComponent implements OnInit {
  @Input()
  hidden: boolean;
  closeIcon = faClose;

  constructor() {}

  ngOnInit() {}

  dismiss() {
    this.hidden = true;
  }
}
