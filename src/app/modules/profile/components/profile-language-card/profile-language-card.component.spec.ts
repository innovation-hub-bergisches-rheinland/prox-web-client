import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLanguageCardComponent } from './profile-language-card.component';

describe('ProfileLanguageCardComponent', () => {
  let component: ProfileLanguageCardComponent;
  let fixture: ComponentFixture<ProfileLanguageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileLanguageCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLanguageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
