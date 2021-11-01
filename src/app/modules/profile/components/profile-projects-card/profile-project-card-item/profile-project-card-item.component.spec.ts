import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProjectCardItemComponent } from './profile-project-card-item.component';

describe('ProfileProjectCardItemComponent', () => {
  let component: ProfileProjectCardItemComponent;
  let fixture: ComponentFixture<ProfileProjectCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileProjectCardItemComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProjectCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
