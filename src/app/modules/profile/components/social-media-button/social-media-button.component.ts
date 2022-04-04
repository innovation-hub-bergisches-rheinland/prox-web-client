import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

export type SocialMedia = 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'XING' | 'INSTAGRAM';

@Component({
  selector: 'app-social-media-button',
  templateUrl: './social-media-button.component.html',
  styleUrls: ['./social-media-button.component.scss']
})
export class SocialMediaButtonComponent {
  @Input()
  icon: IconDefinition;

  @Input()
  url: string;

  @Input()
  color: string;

  @Input()
  text: string;

  get style(): { [klass: string]: any } {
    return {
      'background-color': this.color
    };
  }
}
