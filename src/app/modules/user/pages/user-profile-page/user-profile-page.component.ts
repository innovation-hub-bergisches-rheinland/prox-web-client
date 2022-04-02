import { Component, OnInit } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { UserProfile } from '@data/schema/user-service.types';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@data/service/user.service';
import { KeycloakService } from 'keycloak-angular';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent implements OnInit {
  user$: Observable<UserProfile>;
  avatar: string;
  isOwnProfile: boolean;

  constructor(
    private activatedRouter: ActivatedRoute,
    private userService: UserService,
    private keycloakService: KeycloakService,
    private router: Router
  ) {
    this.user$ = this.activatedRouter.params.pipe(
      map(params => params.id),
      tap(id => {
        this.isOwnProfile = this.keycloakService.getKeycloakInstance().subject === id;
      }),
      mergeMap(id => userService.getUserProfile(id))
    );
  }

  ngOnInit(): void {}
}
