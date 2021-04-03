import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectEditorComponent } from './project-editor.component';

describe('ProjectDialogComponent', () => {
  let component: ProjectEditorComponent;
  let fixture: ComponentFixture<ProjectEditorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProjectEditorComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
