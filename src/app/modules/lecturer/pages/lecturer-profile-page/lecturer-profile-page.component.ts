import { Component } from '@angular/core';
import { Observable, mergeMap, of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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
} from '@modules/lecturer/components/lecturer-profile-editor-dialog/lecturer-profile-editor-dialog.component';
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
  id: string;
  isOwnProfile: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: ProfileService,
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private tagService: TagService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private titleService: Title
  ) {
    this.loadProfile();
  }

  loadProfile() {
    const userId$: Observable<string> = this.activatedRouter.params.pipe(map(params => params.id));
    this.user$ = userId$.pipe(
      take(1),
      tap(id => {
        this.id = id;
        this.isOwnProfile = this.keycloakService.getKeycloakInstance().subject === id;
      }),
      mergeMap(id => this.userService.getLecturer(id).pipe(map(profile => ({ ...profile, id })))),
      tap(user => {
        this.avatar = user.avatarUrl;
      }),
      catchError(error => {
        this.notificationService.error('Benutzerprofil konnte nicht geladen werden.');
        return throwError(() => error);
      }),
      share()
    );

    this.user$.subscribe(user => this.updateTitle(user));

    this.tags$ = this.user$.pipe(map(user => user.tags));
    const projects$: Observable<Project[]> = this.user$.pipe(
      mergeMap(user => this.projectService.findBySupervisor(user.id)),
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
        profile: profile,
        id: this.id
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
