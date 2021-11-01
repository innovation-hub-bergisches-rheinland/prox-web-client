import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEditorPageComponent } from './organization-editor-page.component';

describe('OrganizationEditorPageComponent', () => {
  let component: OrganizationEditorPageComponent;
  let fixture: ComponentFixture<OrganizationEditorPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationEditorPageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEditorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
