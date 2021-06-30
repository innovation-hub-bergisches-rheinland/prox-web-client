import {
  Component,
  HostBinding,
  Input,
  OnInit,
  Renderer2
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

  @HostBinding('class.active')
  active = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}
}
