import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyProgramPickerComponent } from './study-program-picker.component';

describe('StudyProgramPickerComponent', () => {
  let component: StudyProgramPickerComponent;
  let fixture: ComponentFixture<StudyProgramPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudyProgramPickerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyProgramPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
