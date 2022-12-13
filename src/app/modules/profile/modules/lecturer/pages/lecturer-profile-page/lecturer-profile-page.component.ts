import { Component } from '@angular/core';
import { EMPTY, Observable, mergeMap, of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProfileService } from '@data/service/profile.service';
import { KeycloakService } from 'keycloak-angular';
import { catchError, map, share, take, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '@data/service/project.service';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';
import {
  LecturerProfileEditorDialogComponent,
  UserProfileEditorInput
} from '@modules/profile/modules/lecturer/components/lecturer-profile-editor-dialog/lecturer-profile-editor-dialog.component';
import { Title } from '@angular/platform-browser';
import { Lecturer } from '@data/schema/profile.types';
import { Project } from '@data/schema/project.types';

@Component({
  selector: 'app-lecturer-profile-page',
  templateUrl: './lecturer-profile-page.component.html',
  styleUrls: ['./lecturer-profile-page.component.scss']
})
export class LecturerProfilePageComponent {
  user$: Observable<Lecturer>;
  tags$: Observable<string[]>;
  offeredProjects$: Observable<Project[]>;
  projectHistory$: Observable<Project[]>;
  avatar: string;
  isOwnProfile: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: ProfileService,
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
    this.user$ = userId$.pipe(
      take(1),
      mergeMap(id => this.userService.getLecturer(id)),
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

    this.user$.subscribe({
      next: user => this.updateTitle(user)
    });

    this.tags$ = this.user$.pipe(map(user => user.tags));
    const projects$: Observable<Project[]> = this.user$.pipe(
      mergeMap(user => this.projectService.findBySupervisor(user.id)),
      catchError(_err => of([])),
      share()
    );
    this.offeredProjects$ = projects$.pipe(map(projects => projects.filter(project => project.status.state === 'OFFERED')));
    this.projectHistory$ = projects$.pipe(
      map(projects => projects.filter(project => project.status.state === 'RUNNING' || project.status.state === 'COMPLETED'))
    );
  }

  editProfile(profile: Lecturer) {
    const dialog = this.dialog.open(LecturerProfileEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '80%',
      maxWidth: '80%',
      data: {
        profile: profile
      } as UserProfileEditorInput
    });
    dialog.afterClosed().subscribe({
      next: (value: Lecturer) => {
        if (value) {
          // TODO: Better use a publisher rather than a subscriber to directly emit it
          this.loadProfile();
        }
      }
    });
  }

  updateTitle(user: Lecturer) {
    const newTitle = this.titleService.getTitle() + ' - ' + user.name;
    this.titleService.setTitle(newTitle);
  }
}
