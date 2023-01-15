import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { OrganizationService } from '@data/service/organization.service';
import { Observable, map, tap } from 'rxjs';
import { UserProfile } from '@data/schema/user.types';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output()
  burgerClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  isLoggedIn = false;
  userAvatar?: string = null;
  userId: string;
  userProfile$: Observable<UserProfile>;

  constructor(private keycloakService: KeycloakService, private userService: UserService) {}

  async ngOnInit() {
    const isLoggedIn = (this.isLoggedIn = await this.keycloakService.isLoggedIn());
    if (isLoggedIn) {
      this.userId = this.keycloakService.getKeycloakInstance().subject;
      this.userProfile$ = this.userService.getCurrentAuthenticated();
    }
  }

  async login() {
    await this.keycloakService.login({ redirectUri: window.location.href });
  }

  async logout() {
    await this.keycloakService.logout();
  }
}
