import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import {
  faFacebook,
  faFacebookSquare,
  faInstagram,
  faInstagramSquare,
  faLinkedin,
  faTwitter,
  faTwitterSquare,
  faXing,
  faXingSquare
} from '@fortawesome/free-brands-svg-icons';

export type SocialMedia = 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'XING' | 'INSTAGRAM';

@Component({
  selector: 'app-social-media-button',
  templateUrl: './social-media-button.component.html',
  styleUrls: ['./social-media-button.component.scss']
})
export class SocialMediaButtonComponent implements OnInit {
  @Input()
  socialMedia: SocialMedia;

  @Input()
  handle: string;

  get icon(): IconDefinition {
    switch (this.socialMedia) {
      case 'FACEBOOK':
        return faFacebookSquare;
      case 'INSTAGRAM':
        return faInstagramSquare;
      case 'LINKEDIN':
        return faLinkedin;
      case 'TWITTER':
        return faTwitterSquare;
      case 'XING':
        return faXingSquare;
    }
  }

  get url(): string {
    switch (this.socialMedia) {
      case 'FACEBOOK':
        return `https://facebook.com/${this.handle}`;
      case 'INSTAGRAM':
        return `https://www.instagram.com/${this.handle}`;
      case 'LINKEDIN':
        return `https://www.linkedin.com/company/${this.handle}`;
      case 'TWITTER':
        return `https://twitter.com/${this.handle}`;
      case 'XING':
        return `https://www.xing.com/pages/${this.handle}`;
    }
  }

  get style(): { [klass: string]: any } {
    switch (this.socialMedia) {
      case 'FACEBOOK':
        return { color: '#4267b2' };
      case 'INSTAGRAM':
        return { color: '#f77737' };
      case 'LINKEDIN':
        return { color: '#0077b5' };
      case 'TWITTER':
        return { color: '#1da1f2' };
      case 'XING':
        return { color: '#026466' };
    }
  }

  constructor() {}

  ngOnInit(): void {}
}
