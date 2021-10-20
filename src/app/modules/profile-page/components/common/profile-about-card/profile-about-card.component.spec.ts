import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAboutCardComponent } from './profile-about-card.component';

describe('ProfileAboutCardComponent', () => {
  let component: ProfileAboutCardComponent;
  let fixture: ComponentFixture<ProfileAboutCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileAboutCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAboutCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
