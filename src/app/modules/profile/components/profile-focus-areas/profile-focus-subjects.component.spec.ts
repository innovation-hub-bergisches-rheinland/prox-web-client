import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFocusSubjectsComponent } from './profile-focus-subjects.component';

describe('ProfileFocusAreasComponent', () => {
  let component: ProfileFocusSubjectsComponent;
  let fixture: ComponentFixture<ProfileFocusSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileFocusSubjectsComponent]
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
