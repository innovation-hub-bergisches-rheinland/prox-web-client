import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInformationCardEntryComponent } from './profile-information-card-entry.component';

describe('ProfileInformationCardEntryComponent', () => {
  let component: ProfileInformationCardEntryComponent;
  let fixture: ComponentFixture<ProfileInformationCardEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileInformationCardEntryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInformationCardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
