import { Component, Input, OnInit } from '@angular/core';
import { Organization } from '@data/schema/user-service.types';
import { OrganizationEditorDialogComponent } from '@modules/organization/components/organization-editor-dialog/organization-editor-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '@data/service/user.service';
import { faEdit, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs/internal/Observable';
import { TagService } from '@data/service/tag.service';

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

  constructor(private dialog: MatDialog, private userService: UserService, private tagService: TagService) {}

  ngOnInit(): void {
    this.userService.getOrganizationAvatar(this.organization.id).subscribe({
      next: value => (this.imgSrc = value)
    });
    this.tags$ = this.tagService.getTagsForEntity(this.organization.id);
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
