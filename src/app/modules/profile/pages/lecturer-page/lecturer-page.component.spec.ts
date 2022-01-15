import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerPageComponent } from './lecturer-page.component';

describe('LecturerPageComponent', () => {
  let component: LecturerPageComponent;
  let fixture: ComponentFixture<LecturerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LecturerPageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
