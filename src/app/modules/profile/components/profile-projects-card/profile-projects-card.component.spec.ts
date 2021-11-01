import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProjectsCardComponent } from './profile-projects-card.component';

describe('ProfileProjectsCardComponent', () => {
  let component: ProfileProjectsCardComponent;
  let fixture: ComponentFixture<ProfileProjectsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileProjectsCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProjectsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
