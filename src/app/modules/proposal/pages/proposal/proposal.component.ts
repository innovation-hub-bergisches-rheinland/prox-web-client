import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { KeycloakService } from 'keycloak-angular';

import { ProjectService } from '@data/service/project.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Proposal } from '@data/schema/project-service.types';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { of } from 'rxjs';
import { ProposalEditorDialogComponent } from '@modules/proposal/components/proposal-editor-dialog/proposal-editor-dialog.component';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit, AfterViewChecked {
  public proposalsPage: Proposal[] = [];
  public pageIndex = 0;
  public pageSize = 10;
  public isLoggedIn = false;
  public proposals: Proposal[] = [];

  @ViewChild(MatPaginator, { static: true }) private paginator: MatPaginator;

  constructor(
    private projectService: ProjectService,
    private keycloakService: KeycloakService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngAfterViewChecked(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    this.projectService
      .getAllProposals()
      .pipe(
        catchError(err => {
          this.notificationService.error('Ideen konnten nicht geladen werden.');
          return of([]);
        })
      )
      .subscribe({
        next: proposals => {
          this.proposals = proposals;
          this.pageProposals();
        }
      });
  }

  public changePageIndexOrSize(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.pageProposals();
  }

  public openproposalEditorDialog(proposal?: Proposal) {
    this.dialog.open(ProposalEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '85vh',
      data: proposal
    });
  }

  onDeleteProject(proposal: Proposal) {
    this.proposals = this.proposals.filter(p => p.id !== proposal.id);
    this.proposalsPage = this.proposalsPage.filter(p => p.id !== proposal.id);
  }

  onUpdateProject(proposal: Proposal) {
    this.proposals = this.proposals.map(p => {
      if (p.id === proposal.id) {
        return proposal;
      }
      return p;
    });
    this.proposalsPage = this.proposalsPage.map(p => {
      if (p.id === proposal.id) {
        return proposal;
      }
      return p;
    });
  }

  private pageProposals() {
    this.proposalsPage = this.proposals.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}
