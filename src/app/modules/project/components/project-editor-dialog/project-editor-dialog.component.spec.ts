import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProjectEditorDialogComponent } from './project-editor-dialog.component';

describe('ProjectEditorDialogComponent', () => {
  let component: ProjectEditorDialogComponent;
  let fixture: ComponentFixture<ProjectEditorDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ProjectEditorDialogComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEditorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
