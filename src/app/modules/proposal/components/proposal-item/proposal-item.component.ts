import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, catchError, of } from 'rxjs';

import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { Project, Proposal } from '@data/schema/project-service.types';
import { KeycloakService } from 'keycloak-angular';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { Tag } from '@data/schema/tag-service.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { ProposalEditorDialogComponent } from '../proposal-editor-dialog/proposal-editor-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal-item',
  templateUrl: './proposal-item.component.html'
})
export class ProposalItemComponent implements OnChanges {
  @Input()
  proposal: Proposal;

  tags$: Observable<Tag[]>;

  @Output()
  updated: EventEmitter<Proposal> = new EventEmitter<Proposal>();

  @Output()
  deleted: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private keycloakService: KeycloakService,
    private tagService: TagService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async ngOnChanges(changes: SimpleChanges) {
    const proposal: Proposal = changes['proposal'].currentValue;
    if (proposal) {
      this.tags$ = this.tagService.getTagsForEntity(this.proposal.id).pipe(
        catchError(() => {
          this.notificationService.error('Tags konnten nicht geladen werden');
          return of([]);
        })
      );
    }
  }

  editProposal() {
    const dialog = this.dialog.open(ProposalEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: this.proposal
    });

    dialog.afterClosed().subscribe({
      next: (updatedProposal: Proposal) => {
        if (updatedProposal) {
          this.updated.emit(updatedProposal);
        }
      }
    });
  }

  commitProposal() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Commitment abgeben',
        message:
          'Durch Ihr Commitment auf diese Idee erklären Sie sich als Betreuer bereit und die Idee wird in ein Projekt umgewandelt. Wirklich commiten?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.commitForProposal(this.proposal).subscribe({
          next: async (project: Project) => {
            this.notificationService.success('Ihr Commitment wurde abgegeben.');
            await this.router.navigate(['/projects', project.id]);
          },
          error: _error => {
            this.notificationService.error('Commitment konnte nicht abgegeben werden.');
          }
        });
      }
    });
  }

  deleteProposal() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Löschen', message: 'Idee wirklich löschen?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.deleteProposal(this.proposal).subscribe({
          next: () => {
            this.deleted.emit();
          },
          error: _error => {
            this.notificationService.error('Idee konnte nicht gelöscht werden.');
          }
        });
      }
    });
  }
}