import { Component, OnInit } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { UserProfile } from '@data/schema/user-service.types';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';
import { map, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  UserProfileEditorDialogComponent,
  UserProfileEditorInput
} from '@modules/user/components/user-profile-editor-dialog/user-profile-editor-dialog.component';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent implements OnInit {
  user$: Observable<UserProfile>;
  avatar: string;
  id: string;
  isOwnProfile: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.loadProfile();
  }

  loadProfile() {
    this.user$ = this.activatedRouter.params.pipe(
      map(params => params.id),
      tap(id => {
        this.id = id;
        this.isOwnProfile = this.keycloakService.getKeycloakInstance().subject === id;
        this.avatar = this.userService.getUserAvatar(id);
      }),
      mergeMap(id => this.userService.getUserProfile(id))
    );
  }

  ngOnInit(): void {}

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
        if (!!value) {
          // TODO: Better use a publisher rather than a subscriber to directly emit it
          this.loadProfile();
        }
      }
    });
  }
}
