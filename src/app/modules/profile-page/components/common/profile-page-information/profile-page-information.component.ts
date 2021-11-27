import { HostBinding, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TextProcessor } from '@app/util/text-processor';
import { SocialMedia } from '@data/schema/openapi/company-profile-service/socialMedia';
export interface InformationProperty {
  description: string;
  value: string;
  urlProcessing?: boolean;
}

export interface ProfilePageInformation {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  properties: InformationProperty[];
}

@Component({
  selector: 'app-profile-page-information',
  templateUrl: './profile-page-information.component.html',
  styleUrls: ['./profile-page-information.component.scss']
})
export class ProfilePageInformationComponent {
  @HostBinding('class')
  classes: string = 'profile-page-information';

  @Input()
  information: ProfilePageInformation;

  @Input()
  socialMedia: SocialMedia[] = [];

  get informationProperties(): InformationProperty[] {
    return this.information.properties.filter(
      it => it.value && it.value.trim().length > 0
    );
  }

  constructor(public textProcessor: TextProcessor) {}

  getDescription(description: string): string {
    if (!description.trim().endsWith(':')) {
      return description.trim() + ':';
    }
    return description.trim();
  }

  getValue(value: string, process: boolean = false): string {
    if (process) {
      return this.textProcessor.process(value);
    }
    return value;
  }

  get facebookUrl(): string | undefined {
    const account = this.getAccount(SocialMedia.TypeEnum.Facebook);
    return account ? `https://facebook.com/${account}` : undefined;
  }

  get twitterUrl(): string | undefined {
    const account = this.getAccount(SocialMedia.TypeEnum.Twitter);
    return account ? `https://twitter.com/${account}` : undefined;
  }

  get instagramUrl(): string | undefined {
    const account = this.getAccount(SocialMedia.TypeEnum.Instagram);
    return account ? `https://www.instagram.com/${account}` : undefined;
  }

  get xingUrl(): string | undefined {
    const account = this.getAccount(SocialMedia.TypeEnum.Xing);
    return account ? `https://www.xing.com/pages/${account}` : undefined;
  }

  get linkedinUrl(): string | undefined {
    const account = this.getAccount(SocialMedia.TypeEnum.Linkedin);
    return account ? `https://www.linkedin.com/company/${account}` : undefined;
  }

  private getAccount(socialMedia: SocialMedia.TypeEnum): string | undefined {
    return (
      this.socialMedia.find(s => s.type == socialMedia)?.account ?? undefined
    );
  }
}
