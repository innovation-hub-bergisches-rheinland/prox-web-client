import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'organization-list-item',
  templateUrl: './organization-list-item.component.html',
  styleUrls: ['./organization-list-item.component.scss']
})
export class OrganizationListItemComponent implements OnInit {
  @Input() orgLogo: string = 'https://via.placeholder.com/80';
  @Input() orgName: string;
  @Input() isOwner: boolean = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  leaveOrg() {
    const dialog = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Organisation Verlassen',
        message: 'Möchten Sie die Organisation wirklich verlassen'
      }
    });

    dialog.afterClosed().subscribe({
      next: res => {
        if (res) {
          console.log('Would leave org now');
          // TODO: Leave org
        }
      }
    });
  }
}
