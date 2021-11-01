import {
  Component,
  HostBinding,
  Input,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss'],
  host: { class: 'carousel-item' }
})
export class CarouselItem implements OnInit {
  @Input()
  logoUrl: string;

  @Input()
  href: string;

  @HostBinding('class.active')
  active = false;

  constructor() {}

  ngOnInit(): void {}
}
