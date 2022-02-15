import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationOverviewComponent } from './organization-overview.component';

describe('OrganizationOverviewComponent', () => {
  let component: OrganizationOverviewComponent;
  let fixture: ComponentFixture<OrganizationOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationOverviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
