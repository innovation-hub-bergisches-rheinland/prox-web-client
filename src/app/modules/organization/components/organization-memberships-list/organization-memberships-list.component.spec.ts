import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationMembershipsListComponent } from './organization-memberships-list.component';

describe('OrganizationMembershipsListComponent', () => {
  let component: OrganizationMembershipsListComponent;
  let fixture: ComponentFixture<OrganizationMembershipsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationMembershipsListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationMembershipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
