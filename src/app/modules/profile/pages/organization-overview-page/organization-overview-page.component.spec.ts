import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationOverviewPageComponent } from './organization-overview-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OrganizationOverviewPageComponent', () => {
  let component: OrganizationOverviewPageComponent;
  let fixture: ComponentFixture<OrganizationOverviewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationOverviewPageComponent],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationOverviewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
