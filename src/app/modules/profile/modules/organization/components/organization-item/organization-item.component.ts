import { Component, Input, OnInit } from '@angular/core';
import { OrganizationEditorDialogComponent } from '@modules/profile/modules/organization/components/organization-editor-dialog/organization-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from '@data/service/profile.service';
import { faEdit, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs/internal/Observable';
import { TagService } from '@data/service/tag.service';
import { of } from 'rxjs';
import { Organization } from '@data/schema/profile.types';

@Component({
  selector: 'app-organization-item',
  templateUrl: './organization-item.component.html',
  styleUrls: ['./organization-item.component.scss']
})
export class OrganizationItemComponent implements OnInit {
  membersIcon = faPeopleGroup;
  editIcon = faEdit;
  tags$: Observable<string[]>;

  @Input()
  organization: Organization;

  @Input()
  imgSrc: string;

  constructor(private dialog: MatDialog, private userService: ProfileService, private tagService: TagService) {}

  ngOnInit(): void {
    this.imgSrc = this.organization.logoUrl;
    this.tags$ = of(this.organization.tags);
  }

  editOrganization(org: Organization) {
    const dialog = this.dialog.open(OrganizationEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '80%',
      maxWidth: '80%',
      data: org
    });
    dialog.afterClosed().subscribe({
      next: value => {
        if (value) {
          this.organization = value;
        }
      }
    });
  }
}
