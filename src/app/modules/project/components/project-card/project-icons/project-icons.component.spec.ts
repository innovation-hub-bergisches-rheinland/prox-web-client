import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectIconsComponent } from './project-icons.component';

describe('ProjectIconsComponent', () => {
  let component: ProjectIconsComponent;
  let fixture: ComponentFixture<ProjectIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectIconsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
