import { Component, Input, OnInit, Output } from '@angular/core';
import { Proposal } from '@data/schema/project-service.types';
import { Tag } from '@data/schema/tag-service.types';
import { UserService } from '@data/service/user.service';
import { faArrowUp, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-proposal-card',
  templateUrl: './proposal-card.component.html'
})
export class ProposalCardComponent implements OnInit {
  @Input()
  proposal: Proposal;

  @Input()
  tags: Tag[];

  @Input()
  showDetails = false;

  @Output()
  edit: Subject<Proposal> = new Subject<Proposal>();

  @Output()
  delete: Subject<Proposal> = new Subject<Proposal>();

  @Output()
  commit: Subject<Proposal> = new Subject<Proposal>();

  editIcon = faPen;
  deleteIcon = faTrash;
  commitIcon = faArrowUp;

  ownerProfileRouter: string[];

  constructor(private userService: UserService, private notificationService: NotificationService) {}

  ngOnInit() {
    switch (this.proposal.owner.discriminator) {
      case 'user':
        this.ownerProfileRouter = ['/users', this.proposal.owner.id];
        break;
      case 'organization':
        this.ownerProfileRouter = ['/organizations', this.proposal.owner.id];
        break;
    }
  }

  onDeleteClick() {
    this.delete.next(this.proposal);
  }

  onEditClick() {
    this.edit.next(this.proposal);
  }

  onCommitClick() {
    this.commit.next(this.proposal);
  }
}
