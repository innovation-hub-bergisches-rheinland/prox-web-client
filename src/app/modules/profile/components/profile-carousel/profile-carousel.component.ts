import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Directive,
  Input
} from '@angular/core';

export interface SliderImage {
  readonly path: string;
}

@Component({
  selector: 'app-profile-carousel',
  templateUrl: './profile-carousel.component.html',
  styleUrls: ['./profile-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCarouselComponent implements OnInit {
  @Input()
  images: SliderImage[];

  constructor() {}

  ngOnInit(): void {}
}
