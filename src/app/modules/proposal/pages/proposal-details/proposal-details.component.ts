import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { ProjectService } from '@data/service/project.service';
import { Proposal } from '@data/schema/project-service.types';
import { NotificationService } from '@shared/modules/notifications/notification.service';

@Component({
  selector: 'app-proposal-details',
  templateUrl: './proposal-details.component.html'
})
export class ProposalDetailsComponent implements OnInit {
  proposal: Proposal;

  constructor(
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.projectService.getProposal(projectId).subscribe({
      next: res => (this.proposal = res),
      error: err => {
        this.notificationService.error('Idee nicht gefunden');
        this.goBack();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  onUpdate(proposal: Proposal) {
    this.proposal = proposal;
  }
}
