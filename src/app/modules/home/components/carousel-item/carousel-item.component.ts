import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss']
})
export class CarouselItemComponent {
  @HostBinding('class')
  classes: string = 'carousel-item';

  @Input()
  logoUrl: string;

  @Input()
  href: string;

  @HostBinding('class.active')
  active = false;

  constructor() {}
}
