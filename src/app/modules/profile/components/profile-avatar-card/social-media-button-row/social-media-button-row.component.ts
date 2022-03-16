import { Component, Input, OnInit } from '@angular/core';
import {
  faFacebookSquare,
  faInstagramSquare,
  faLinkedin,
  faTwitterSquare,
  faXingSquare,
  faYoutubeSquare
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-social-media-button-row',
  templateUrl: './social-media-button-row.component.html',
  styleUrls: ['./social-media-button-row.component.scss']
})
export class SocialMediaButtonRowComponent implements OnInit {
  @Input()
  facebookHandle;

  @Input()
  twitterHandle;

  @Input()
  instagramHandle;

  @Input()
  xingHandle;

  @Input()
  linkedInHandle;

  @Input()
  youtubeHandle;

  facebookIcon = faFacebookSquare;
  instagramIcon = faInstagramSquare;
  twitterIcon = faTwitterSquare;
  likedInIcon = faLinkedin;
  xingIcon = faXingSquare;
  youtubeIcon = faYoutubeSquare;

  constructor() {}

  ngOnInit(): void {}
}
