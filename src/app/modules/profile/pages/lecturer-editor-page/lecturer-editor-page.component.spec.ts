import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturerEditorPageComponent } from './lecturer-editor-page.component';

describe('LecturerEditorPageComponent', () => {
  let component: LecturerEditorPageComponent;
  let fixture: ComponentFixture<LecturerEditorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LecturerEditorPageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturerEditorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
