import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { OrganizationEditMemberDialogComponent } from '@modules/organization/components/organization-edit-member-dialog/organization-edit-member-dialog.component';
import { OrganizationMembership } from '@data/schema/profile.types';

@Component({
  selector: 'app-organization-memberships-list',
  templateUrl: './organization-memberships-list.component.html',
  styleUrls: ['./organization-memberships-list.component.scss']
})
export class OrganizationMembershipsListComponent {
  @Input()
  memberships: OrganizationMembership[] = [];
  @Input()
  showControls = false;
  @Input()
  showAdminControls = false;

  @Output()
  membershipRemoved = new EventEmitter<OrganizationMembership>();
  @Output()
  membershipUpdated = new EventEmitter<OrganizationMembership>();

  constructor(private dialog: MatDialog) {}

  get administrators(): OrganizationMembership[] {
    return this.memberships?.filter(m => m.role === 'ADMIN') ?? [];
  }

  get members(): OrganizationMembership[] {
    return this.memberships?.filter(m => m.role === 'MEMBER') ?? [];
  }

  get atLeastTwoAdmins(): boolean {
    return this.administrators.length > 1;
  }

  editMembership(member: OrganizationMembership) {
    const dialogRef = this.dialog.open(OrganizationEditMemberDialogComponent, {
      data: {
        membership: member
      }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(value => !!value))
      .subscribe({
        next: (value: OrganizationMembership) => this.membershipUpdated.emit(value)
      });
  }

  removeMembership(member: OrganizationMembership) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Mitglied entfernen', message: `Mitglied wirklich aus der Organisation entfernen?` }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(value => value === true))
      .subscribe({
        next: () => this.membershipRemoved.emit(member)
      });
  }
}
