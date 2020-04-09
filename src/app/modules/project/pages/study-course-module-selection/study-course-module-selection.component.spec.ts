import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCourseModuleSelectionComponent } from './study-course-module-selection.component';

describe('StudyCourseModuleSelectionComponent', () => {
  let component: StudyCourseModuleSelectionComponent;
  let fixture: ComponentFixture<StudyCourseModuleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StudyCourseModuleSelectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyCourseModuleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
