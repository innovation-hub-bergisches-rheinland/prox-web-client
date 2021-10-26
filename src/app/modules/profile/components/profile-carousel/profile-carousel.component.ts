import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Directive
} from '@angular/core';

@Component({
  selector: 'app-profile-carousel',
  templateUrl: './profile-carousel.component.html',
  styleUrls: ['./profile-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCarouselComponent implements OnInit {
  imagesForSlider = [
    { path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab' },
    { path: 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8' },
    { path: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625' }
  ];

  constructor() {}

  ngOnInit(): void {}
}
