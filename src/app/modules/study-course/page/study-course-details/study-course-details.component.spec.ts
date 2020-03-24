import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCourseDetailsComponent } from './study-course-details.component';

describe('StudyCourseDetailsComponent', () => {
  let component: StudyCourseDetailsComponent;
  let fixture: ComponentFixture<StudyCourseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudyCourseDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyCourseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
