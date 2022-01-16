import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAvatarCardComponent } from './profile-avatar-card.component';
import { SocialMediaButtonComponent } from '@modules/profile/components/social-media-button/social-media-button.component';

describe('ProfileCardComponent', () => {
  let component: ProfileAvatarCardComponent;
  let fixture: ComponentFixture<ProfileAvatarCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileAvatarCardComponent, SocialMediaButtonComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAvatarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
