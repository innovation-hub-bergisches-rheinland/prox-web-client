import { Component, Input, OnInit } from '@angular/core';
import { FocusSubject } from '@modules/profile/components/profile-focus-areas/profile-focus-subjects.component';
import { Language } from '@modules/profile/components/profile-language-card/profile-language-card.component';
import { AboutEntry } from '@modules/profile/components/profile-information-card/profile-information-card.component';
import { SocialMedia } from '@modules/profile/components/profile-avatar-card/profile-avatar-card.component';
import { AvailableJob } from '@modules/profile/components/profile-jobs-card/profile-jobs-card.component';
import { AvailableProject } from '@modules/profile/components/profile-projects-card/profile-projects-card.component';
import { ProjectHistoryItem } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';
import { Publication } from '@modules/profile/components/profile-publications-card/profile-publications-card.component';

export interface Sash {
  readonly title: string;
  readonly text: string;
}

export interface Profile {
  readonly title: string;
  readonly avatarUrl?: string;
  readonly subtitle?: string;
  readonly socialMedia?: SocialMedia;
  readonly focusSubjects?: FocusSubject[];
  readonly languages?: Language[];
  readonly about?: AboutEntry[];
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  @Input()
  profile: Profile;

  @Input()
  sash: Sash;

  @Input()
  availableJobs: AvailableJob[];

  @Input()
  availableProjects: AvailableProject[];

  @Input()
  projectHistory: ProjectHistoryItem[];

  @Input()
  publications: Publication[];

  @Input()
  showEditRow: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}