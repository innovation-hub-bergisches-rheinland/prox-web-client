import { Component, Input, OnInit } from '@angular/core';
import {
  faFacebookSquare,
  faInstagramSquare,
  faLinkedin,
  faTwitterSquare,
  faXingSquare,
  faYoutubeSquare
} from '@fortawesome/free-brands-svg-icons';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-social-media-card',
  templateUrl: './profile-social-media-card.component.html',
  styleUrls: ['./profile-social-media-card.component.scss']
})
export class ProfileSocialMediaCardComponent {
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
  hashtagIcon = faHashtag;

  /**
   * YouTube offers two separate types of handles. A username and a channel ID. Both are valid options to use as a handle.
   * However, they need different types of base links. As a workaround we simply test the handle based on the excellent research
   * done by Glenn Slayden: {@link https://webapps.stackexchange.com/a/101153}
   * @param youtubeHandle
   */
  buildYoutubeLink(youtubeHandle: string) {
    if (youtubeHandle.startsWith('UC') && /[0-9A-Za-z_-]{21}[AQgw]/.test(youtubeHandle.substring(2))) {
      return `https://www.youtube.com/channel/${youtubeHandle}`;
    }
    return `https://www.youtube.com/user/${youtubeHandle}`;
  }
}
