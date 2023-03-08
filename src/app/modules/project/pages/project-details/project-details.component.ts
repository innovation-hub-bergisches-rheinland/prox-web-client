import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { ProjectService } from '@data/service/project.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Project } from '@data/schema/project.types';
import { Tag } from '@data/schema/tag.types';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project$: Observable<Project>;
  project: Project;

  constructor(
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
    private titleService: Title
  ) {}

  async ngOnInit() {
    const projectId = this.route.snapshot.paramMap.get('id');
    this.project$ = this.projectService.getProject(projectId);

    this.project$.subscribe(project => {
      this.updateTitle(project);
    });

    this.project$.subscribe({
      next: res => {
        this.project = res;
      },
      error: err => {
        this.notificationService.error('Projekt nicht gefunden');
        this.goBack();
      }
    });
  }

  goBack() {
    this.location.back();
  }

  updateTitle(project: Project) {
    const newTitle = this.titleService.getTitle() + ' - ' + project.title;
    this.titleService.setTitle(newTitle);
  }

  navigateToTagSearch(tag: Tag) {
    this.router.navigate(['/projects'], {
      queryParams: {
        tags: tag.tagName
      }
    });
  }
}
