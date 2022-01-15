import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileJobsCardItemComponent } from './profile-jobs-card-item.component';

describe('ProfileJobsCardItemComponent', () => {
  let component: ProfileJobsCardItemComponent;
  let fixture: ComponentFixture<ProfileJobsCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileJobsCardItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileJobsCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
