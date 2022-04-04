import { Component } from '@angular/core';
import { Observable, mergeMap } from 'rxjs';
import { UserProfile } from '@data/schema/user-service.types';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';
import { catchError, map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  UserProfileEditorDialogComponent,
  UserProfileEditorInput
} from '@modules/user/components/user-profile-editor-dialog/user-profile-editor-dialog.component';
import { ProjectService } from '@data/service/project.service';
import { ProjectWithAssociations } from '@data/schema/project-service.types';
import { ProjectHistoryItem } from '@modules/profile/components/profile-project-history/profile-project-history-item/profile-project-history-item.component';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent {
  user$: Observable<UserProfile>;
  offeredProjects$: Observable<ProjectWithAssociations[]>;
  projectHistory$: Observable<ProjectHistoryItem[]>;
  avatar: string;
  id: string;
  isOwnProfile: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loadProfile();
  }

  loadProfile() {
    const userId$: Observable<string> = this.activatedRouter.params.pipe(map(params => params.id));
    this.user$ = userId$.pipe(
      tap(id => {
        this.id = id;
        this.isOwnProfile = this.keycloakService.getKeycloakInstance().subject === id;
        this.avatar = this.userService.getUserAvatar(id);
      }),
      mergeMap(id => this.userService.getUserProfile(id))
    );
    this.offeredProjects$ = userId$.pipe(mergeMap(id => this.projectService.findAvailableProjectsOfCreator(id, 'withAssociations')));
    this.projectHistory$ = userId$.pipe(
      mergeMap(id => this.projectService.findRunningAndFinishedProjectsOfCreator(id)),
      map(projects =>
        projects.map(project => {
          return {
            id: project.id,
            title: project.name,
            supervisor: project.supervisorName,
            description: project.shortDescription
          };
        })
      ),
      catchError(err => [])
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
