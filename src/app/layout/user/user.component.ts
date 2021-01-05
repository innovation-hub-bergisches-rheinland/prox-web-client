import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username: string;
  isLoggedIn: boolean;
  isProfessor: boolean;
  userId: string;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      const userProfile = await this.keycloakService.loadUserProfile();
      this.username = `${userProfile.firstName} ${userProfile.lastName}`;
      this.isLoggedIn = true;
      this.isProfessor = this.keycloakService
        .getUserRoles()
        .includes('professor');
      this.userId = this.keycloakService.getKeycloakInstance().subject;
    } else {
      this.isLoggedIn = false;
      this.username = '';
    }
  }

  async login() {
    await this.keycloakService.login({ redirectUri: window.location.href });
  }

  async logout() {
    await this.keycloakService.logout();
  }

  profProfile() {
    const navigationDetails: string[] = ['/professors'];
    navigationDetails.push(this.userId);
    this.router.navigate(navigationDetails);
  }
}
