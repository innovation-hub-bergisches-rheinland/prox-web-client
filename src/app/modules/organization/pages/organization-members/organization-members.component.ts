import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationService } from '@data/service/organization.service';
import { Observable, lastValueFrom, mergeMap, of } from 'rxjs';
import { catchError, filter, map } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationAddMemberDialogComponent } from '@modules/organization/components/organization-add-member-dialog/organization-add-member-dialog.component';
import { Location } from '@angular/common';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { AddOrganizationMembershipRequest, Organization, OrganizationMembership } from '@data/schema/organization.types';

@Component({
  selector: 'app-organization-members',
  templateUrl: './organization-members.component.html',
  styleUrls: ['./organization-members.component.scss']
})
export class OrganizationMembersComponent implements OnInit {
  organization$: Observable<Organization>;
  organizationMemberships$: Observable<OrganizationMembership[]>;
  hasPermission = false;

  constructor(
    private route: ActivatedRoute,
    public location: Location,
    private userService: OrganizationService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe({
      next: params => {
        const id = params['id'];
        if (id) {
          this.organization$ = this.userService.getOrganization(id);
          this.getMembers(id);
        }
      }
    });
    this.organization$.subscribe({
      next: value => (this.hasPermission = value._permissions.hasAccess)
    });
  }

  getMembers(id: string) {
    this.organizationMemberships$ = this.userService.getMemberships(id).pipe(
      catchError(err => {
        this.notificationService.error('Mitglieder konnten nicht geladen werden, versuchen Sie es später erneut');
        return of([]);
      })
    );
  }

  async removeMembership(member: OrganizationMembership) {
    const activeOrg = await lastValueFrom(this.organization$);
    const delete$ = this.userService.deleteMembership(activeOrg.id, member.member).pipe(
      catchError(err => {
        this.notificationService.error('Mitgliedschaft konnte nicht entfernt werden');
        return of([]);
      })
    );
    await lastValueFrom(delete$);
    this.getMembers(activeOrg.id);
  }

  async updateMembership(member: OrganizationMembership) {
    const activeOrg = await lastValueFrom(this.organization$);
    const update$ = this.userService.updateMembership(activeOrg.id, member.member, member.role).pipe(
      catchError(err => {
        this.notificationService.error('Mitgliedschaft konnte nicht aktualisiert werden');
        return of([]);
      })
    );
    await lastValueFrom(update$);
    this.getMembers(activeOrg.id);
  }

  async openMemberAddDialog() {
    const activeOrg = await lastValueFrom(this.organization$);
    const activeMembers = await lastValueFrom(this.organizationMemberships$);

    const dialogRef = this.dialog.open(OrganizationAddMemberDialogComponent, {
      data: {
        activeMembers: activeMembers
      }
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(value => !!value),
        mergeMap((value: AddOrganizationMembershipRequest) => this.userService.createMembership(activeOrg.id, value.member, value.role))
      )
      .subscribe({
        next: () => this.getMembers(activeOrg.id)
      });
  }
}
