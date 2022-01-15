import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCardHeaderComponent } from './profile-card-header.component';

describe('ProfileCardHeaderComponent', () => {
  let component: ProfileCardHeaderComponent;
  let fixture: ComponentFixture<ProfileCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileCardHeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
