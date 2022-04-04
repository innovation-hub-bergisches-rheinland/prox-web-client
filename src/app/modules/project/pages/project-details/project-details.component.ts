import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { ProjectService } from '@data/service/project.service';
import { Project } from '@data/schema/project-service.types';
import { ToastService } from '@modules/toast/toast.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project;

  constructor(
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(projectId).subscribe({
      next: res => (this.project = res),
      error: err => {
        this.toastService.showToast({
          isError: true,
          message: 'Projekt nicht gefunden'
        });
        this.goBack();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  onUpdate(project: Project) {
    this.project = project;
  }
}
