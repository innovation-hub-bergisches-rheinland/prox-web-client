import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFocusSubjectsComponent } from './profile-focus-subjects.component';
import { ProfileCardComponent, ProfileCardContentDirective } from '@modules/profile/components/profile-card/profile-card.component';
import {
  ProfileCardHeaderComponent,
  ProfileCardTitleDirective
} from '@modules/profile/components/profile-card/profile-card-header/profile-card-header.component';

describe('ProfileFocusAreasComponent', () => {
  let component: ProfileFocusSubjectsComponent;
  let fixture: ComponentFixture<ProfileFocusSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ProfileFocusSubjectsComponent,
        ProfileCardComponent,
        ProfileCardHeaderComponent,
        ProfileCardTitleDirective,
        ProfileCardContentDirective
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileFocusSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
