import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileJobsCardComponent } from './profile-jobs-card.component';

describe('ProfileJobsCardComponent', () => {
  let component: ProfileJobsCardComponent;
  let fixture: ComponentFixture<ProfileJobsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileJobsCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileJobsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
