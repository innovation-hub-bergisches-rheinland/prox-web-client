import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreateOrganizationMembership, Organization, OrganizationMembership, UserSearchResult } from '@data/schema/user-service.types';
import { UserService } from '@data/service/user.service';
import { combineLatestWith, EMPTY, empty, lastValueFrom, mergeMap, Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationAddMemberDialogComponent } from '@modules/organization/components/organization-add-member-dialog/organization-add-member-dialog.component';
import { Location } from '@angular/common';

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
    private userService: UserService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog
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
      next: value => (this.hasPermission = value.permissions.canEdit)
    });
  }

  getMembers(id: string) {
    this.organizationMemberships$ = this.userService.getMemberships(id).pipe(map(membership => membership.members));
  }

  async removeMembership(member: OrganizationMembership) {
    const activeOrg = await lastValueFrom(this.organization$);
    await lastValueFrom(this.userService.deleteMembership(activeOrg.id, member.memberId));
    this.getMembers(activeOrg.id);
  }

  async updateMembership(member: OrganizationMembership) {
    const activeOrg = await lastValueFrom(this.organization$);
    await lastValueFrom(
      this.userService.updateMembership(activeOrg.id, member.memberId, {
        role: member.role
      })
    );
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
        mergeMap((value: CreateOrganizationMembership) => this.userService.createMembership(activeOrg.id, value.member, value.role))
      )
      .subscribe({
        next: () => this.getMembers(activeOrg.id)
      });
  }
}
