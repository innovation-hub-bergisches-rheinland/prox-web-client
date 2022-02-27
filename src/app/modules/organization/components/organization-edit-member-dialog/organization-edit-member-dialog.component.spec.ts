import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationEditMemberDialogComponent } from './organization-edit-member-dialog.component';

describe('OrganizationAddMemberDialogComponent', () => {
  let component: OrganizationEditMemberDialogComponent;
  let fixture: ComponentFixture<OrganizationEditMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationEditMemberDialogComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationEditMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
