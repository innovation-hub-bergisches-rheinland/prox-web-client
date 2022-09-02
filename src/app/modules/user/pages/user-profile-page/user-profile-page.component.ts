import { Component } from '@angular/core';
import { Observable, mergeMap, of, throwError } from 'rxjs';
import { UserProfile } from '@data/schema/user-service.types';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';
import { catchError, map, take, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  UserProfileEditorDialogComponent,
  UserProfileEditorInput
} from '@modules/user/components/user-profile-editor-dialog/user-profile-editor-dialog.component';
import { ProjectService } from '@data/service/project.service';
import { Project } from '@data/schema/project-service.types';
import { TagService } from '@data/service/tag.service';
import { NotificationService } from '@shared/modules/notifications/notification.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent {
  user$: Observable<UserProfile & { id: string }>;
  tags$: Observable<string[]>;
  offeredProjects$: Observable<Project[]>;
  projectHistory$: Observable<Project[]>;
  avatar: string;
  id: string;
  isOwnProfile: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private tagService: TagService,
    private dialog: MatDialog,
    private notificationService: NotificationService
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
        this.avatar = this.userService.getUserAvatar(id);
      }),
      mergeMap(id => this.userService.getUserProfile(id).pipe(map(profile => ({ ...profile, id })))),
      catchError(error => {
        this.notificationService.error('Benutzerprofil konnte nicht geladen werden.');
        return throwError(() => error);
      })
    );
    this.tags$ = this.user$.pipe(
      take(1),
      mergeMap(user => this.tagService.getTagsForEntity(user.id)),
      catchError(err => {
        this.notificationService.warning('Tags konnte nicht geladen werden.');
        return of([]);
      })
    );
    const projects$ = this.user$.pipe(
      take(1),
      mergeMap(user => this.projectService.findProjectsOfUser(user.id)),
      catchError(err => {
        this.notificationService.warning('Projekte konnte nicht geladen werden.');
        return of([]);
      })
    );
    this.offeredProjects$ = projects$.pipe(map(projects => projects.filter(p => p.status === 'AVAILABLE')));
    this.projectHistory$ = projects$.pipe(
      map(projects => projects.filter(p => p.status !== 'AVAILABLE')),
      catchError(err => {
        this.notificationService.warning('Projekthistorie konnte nicht geladen werden.');
        return of([]);
      })
    );
  }

  editProfile(profile: UserProfile) {
    const dialog = this.dialog.open(UserProfileEditorDialogComponent, {
      autoFocus: false,
      maxHeight: '80%',
      maxWidth: '80%',
      data: {
        profile: profile,
        id: this.id
      } as UserProfileEditorInput
    });
    dialog.afterClosed().subscribe({
      next: (value: UserProfile) => {
        if (value) {
          // TODO: Better use a publisher rather than a subscriber to directly emit it
          this.loadProfile();
        }
      }
    });
  }
}
