import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrganizationMembership, OrganizationRole, UpdateOrganizationMembership } from '@data/schema/user-service.types';
import { Subject } from 'rxjs';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { OrganizationEditMemberDialogComponent } from '@modules/organization/components/organization-edit-member-dialog/organization-edit-member-dialog.component';

@Component({
  selector: 'app-organization-memberships-list',
  templateUrl: './organization-memberships-list.component.html',
  styleUrls: ['./organization-memberships-list.component.scss']
})
export class OrganizationMembershipsListComponent implements OnInit {
  @Input()
  memberships: OrganizationMembership[] = [];
  @Input()
  showControls: boolean = false;
  @Input()
  showAdminControls: boolean = false;

  @Output()
  onRemoveMembership = new EventEmitter<OrganizationMembership>();
  @Output()
  onUpdateMembership = new EventEmitter<OrganizationMembership>();

  get administrators(): OrganizationMembership[] {
    return this.memberships?.filter(m => m.role === 'ADMIN') ?? [];
  }

  get members(): OrganizationMembership[] {
    return this.memberships?.filter(m => m.role === 'MEMBER') ?? [];
  }

  get atLeastTwoAdmins(): boolean {
    return this.administrators.length > 1;
  }

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

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
        next: (value: OrganizationMembership) => this.onUpdateMembership.emit(value)
      });
  }

  removeMembership(member: OrganizationMembership) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Mitglied entfernen', message: `Mitglied ${member.name} wirklich aus der Organisation entfernen?` }
    });

    dialogRef
      .afterClosed()
      .pipe(filter(value => value === true))
      .subscribe({
        next: () => this.onRemoveMembership.emit(member)
      });
  }
}
