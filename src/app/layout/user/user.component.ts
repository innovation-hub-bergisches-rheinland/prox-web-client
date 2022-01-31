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
  isCompanyManager: boolean = false;
  userId: string;

  constructor(private keycloakService: KeycloakService, private router: Router) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      const userProfile = await this.keycloakService.loadUserProfile();
      this.username = `${userProfile.firstName} ${userProfile.lastName}`;
      this.isLoggedIn = true;
      this.isProfessor = this.keycloakService.getUserRoles().includes('professor');
      this.isCompanyManager = this.keycloakService.getUserRoles().includes('company-manager');
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

  companyProfile() {
    const navigationDetails: string[] = ['/companies/me'];
    this.router.navigate(navigationDetails).then(
      () => window.location.reload() //Reload to hide sidenav and take some complexity away when profile does not exist
    );
  }
}
