import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TextProcessor } from '@app/util/text-processor';
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
  styleUrls: ['./profile-page-information.component.scss'],
  host: { class: 'profile-page-information' }
})
export class ProfilePageInformationComponent implements OnInit {
  @Input()
  information: ProfilePageInformation;

  get informationProperties(): InformationProperty[] {
    return this.information.properties.filter(
      it => it.value && it.value.trim().length > 0
    );
  }

  constructor(public textProcessor: TextProcessor) {}

  ngOnInit(): void {}

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
}
