import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePageCarouselComponent } from './profile-page-carousel.component';

describe('ProfilePageCarouselComponent', () => {
  let component: ProfilePageCarouselComponent;
  let fixture: ComponentFixture<ProfilePageCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfilePageCarouselComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
