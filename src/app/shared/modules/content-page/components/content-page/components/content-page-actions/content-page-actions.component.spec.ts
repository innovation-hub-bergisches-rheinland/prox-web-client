import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPageActionsComponent } from './content-page-actions.component';

describe('ContentPageActionRowComponent', () => {
  let component: ContentPageActionsComponent;
  let fixture: ComponentFixture<ContentPageActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentPageActionsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
