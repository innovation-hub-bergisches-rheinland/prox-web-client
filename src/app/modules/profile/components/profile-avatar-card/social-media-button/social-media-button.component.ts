import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';

export type SocialMedia = 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'XING' | 'INSTAGRAM';

@Component({
  selector: 'app-social-media-button',
  templateUrl: './social-media-button.component.html',
  styleUrls: ['./social-media-button.component.scss']
})
export class SocialMediaButtonComponent implements OnInit {
  @Input()
  icon: IconDefinition;

  @Input()
  url: string;

  @Input()
  color: string;

  get style(): { [klass: string]: any } {
    return {
      color: this.color
    };
  }

  constructor() {}

  ngOnInit(): void {}
}
