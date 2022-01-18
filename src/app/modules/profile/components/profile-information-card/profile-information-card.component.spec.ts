import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInformationCardComponent } from './profile-information-card.component';

describe('ProfileInformationCardComponent', () => {
  let component: ProfileInformationCardComponent;
  let fixture: ComponentFixture<ProfileInformationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileInformationCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInformationCardComponent);
    component = fixture.componentInstance;
    component.entries = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
