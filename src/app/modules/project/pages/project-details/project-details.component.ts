import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { KeycloakService } from 'keycloak-angular';
import { ProjectService } from '@data/service/project.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Title } from '@angular/platform-browser';
import { Observable, map, mergeMap } from 'rxjs';
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
  tagIds: string[];
  excludedIds: string[];

  constructor(
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private notificationService: NotificationService,
    private titleService: Title
  ) {}

  async ngOnInit() {
    const projectId$: Observable<string> = this.route.params.pipe(map(params => params.id));
    this.project$ = projectId$.pipe(mergeMap(id => this.projectService.getProject(id)));

    this.project$.subscribe(project => {
      this.updateTitle(project);
    });

    this.project$.subscribe({
      next: res => {
        this.project = res;
        this.tagIds = this.project.tags.map(tag => tag.id);
        this.excludedIds = [
          this.project.author.userId,
          this.project.id,
          ...(this.project?.supervisors?.map(s => s.id) ?? []),
          this.project.partner?.id
        ];
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
