import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrganizationEditorDialogComponent } from '@modules/organization/components/organization-editor-dialog/organization-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { OrganizationService } from '@data/service/organization.service';
import { faEdit, faPeopleGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs/internal/Observable';
import { TagService } from '@data/service/tag.service';
import { of } from 'rxjs';
import { Organization } from '@data/schema/organization.types';
import { Tag } from '@data/schema/tag.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { OrganizationDeleteDialogueComponent } from '@modules/organization/components/organization-delete-dialog/organization-delete-dialogue.component';

@Component({
  selector: 'app-organization-item',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.scss']
})
export class OrganizationItemComponent implements OnInit {
  membersIcon = faPeopleGroup;
  editIcon = faEdit;
  deleteIcon = faTrash;
  tags$: Observable<Tag[]>;

  @Input()
  organization: Organization;

  @Output() organizationChanged = new EventEmitter<void>();

  @Input()
  imgSrc: string;

  constructor(
    private dialog: MatDialog,
    private userService: OrganizationService,
    private tagService: TagService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.imgSrc = this.organization.logoUrl;
    this.tags$ = of(this.organization.tags);
  }

  editOrganization(org: Organization) {
    const dialog = this.dialog.open(OrganizationEditorDialogComponent, {
      autoFocus: false,
      data: org
    });
    dialog.afterClosed().subscribe({
      next: value => {
        if (value) {
          this.organization = value;
          this.organizationChanged.emit();
        }
      }
    });
  }

  deleteOrganization(org: Organization) {
    const dialog = this.dialog.open(OrganizationDeleteDialogueComponent, {
      data: org.name
    });
    dialog.beforeClosed().subscribe({
      next: value => {
        if (value == true) {
          this.notificationService.info('Organisation wird gelöscht...');
        }
      }
    });
    dialog.afterClosed().subscribe({
      next: value => {
        if (value == true) {
          this.userService.deleteOrganization(org.id).subscribe({
            next: value => {
              if (value.ok) {
                this.notificationService.success('Organisation wurde erfolgreich gelöscht');
                this.organizationChanged.emit();
              }
            },
            error: err => {
              this.notificationService.error('Fehler beim Löschen der Organisation');
            }
          });
        }
      }
    });
  }
}
