import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLanguageCardEntryComponent } from './profile-language-card-entry.component';

describe('LanguageEntryComponent', () => {
  let component: ProfileLanguageCardEntryComponent;
  let fixture: ComponentFixture<ProfileLanguageCardEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileLanguageCardEntryComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLanguageCardEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
