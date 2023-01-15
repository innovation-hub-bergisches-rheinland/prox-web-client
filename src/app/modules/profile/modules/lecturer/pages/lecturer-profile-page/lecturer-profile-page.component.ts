import { Component } from '@angular/core';
import { EMPTY, Observable, mergeMap, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { catchError, map, share, take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '@data/service/project.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import { Title } from '@angular/platform-browser';
import { Project } from '@data/schema/project.types';
import { LecturerService } from '@data/service/lecturer.service';
import { Lecturer } from '@data/schema/lecturer.types';

@Component({
  selector: 'app-lecturer-profile-page',
  templateUrl: './lecturer-profile-page.component.html',
  styleUrls: ['./lecturer-profile-page.component.scss']
})
export class LecturerProfilePageComponent {
  lecturer$: Observable<Lecturer>;
  tags: string[];
  offeredProjects$: Observable<Project[]>;
  projectHistory$: Observable<Project[]>;
  avatar: string;
  isOwnProfile: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private lecturerService: LecturerService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private titleService: Title,
    private router: Router,
    private location: Location
  ) {
    this.loadProfile();
  }

  loadProfile() {
    const userId$: Observable<string> = this.activatedRouter.params.pipe(map(params => params.id));
    this.lecturer$ = userId$.pipe(
      take(1),
      mergeMap(id => this.lecturerService.getLecturer(id)),
      catchError(err => {
        this.notificationService.error('Benutzerprofil konnte nicht geladen werden.');
        if (err?.status === 404) {
          this.router.navigate(['/404']);
        }

        this.location.back();

        return EMPTY;
      }),
      share()
    );

    this.lecturer$.subscribe({
      next: user => {
        this.updateTitle(user);
        this.tags = user.lecturerProfile?.tags?.map(t => t.tagName) ?? [];
      }
    });

    const projects$: Observable<Project[]> = this.lecturer$.pipe(
      mergeMap(user => this.projectService.findBySupervisor(user.userId)),
      map(p => p.content),
      catchError(_err => of([])),
      share()
    );
    this.offeredProjects$ = projects$.pipe(map(projects => projects.filter(project => project.status.state === 'OFFERED')));
    this.projectHistory$ = projects$.pipe(
      map(projects => projects.filter(project => project.status.state === 'RUNNING' || project.status.state === 'COMPLETED'))
    );
  }

  updateTitle(user: Lecturer) {
    const newTitle = this.titleService.getTitle() + ' - ' + user.displayName;
    this.titleService.setTitle(newTitle);
  }
}
