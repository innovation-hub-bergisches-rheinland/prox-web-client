import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAddMemberDialogComponent } from './organization-add-member-dialog.component';

describe('OrganizationAddMemberDialogComponent', () => {
  let component: OrganizationAddMemberDialogComponent;
  let fixture: ComponentFixture<OrganizationAddMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationAddMemberDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationAddMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
