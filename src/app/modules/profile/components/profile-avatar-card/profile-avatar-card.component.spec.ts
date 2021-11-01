import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAvatarCardComponent } from './profile-card.component';

describe('ProfileCardComponent', () => {
  let component: ProfileAvatarCardComponent;
  let fixture: ComponentFixture<ProfileAvatarCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileAvatarCardComponent]
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
