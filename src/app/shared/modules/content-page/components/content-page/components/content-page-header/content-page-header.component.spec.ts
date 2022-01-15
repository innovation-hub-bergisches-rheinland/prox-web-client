import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPageHeaderComponent } from './content-page-header.component';

describe('ContentPageHeaderComponent', () => {
  let component: ContentPageHeaderComponent;
  let fixture: ComponentFixture<ContentPageHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentPageHeaderComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
