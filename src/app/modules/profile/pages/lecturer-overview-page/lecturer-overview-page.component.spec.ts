import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerOverviewPageComponent } from './lecturer-overview-page.component';

describe('LecturerOverviewPageComponent', () => {
  let component: LecturerOverviewPageComponent;
  let fixture: ComponentFixture<LecturerOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LecturerOverviewPageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
