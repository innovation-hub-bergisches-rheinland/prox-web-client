import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userDetails: KeycloakProfile;

  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.userDetails = await this.keycloakService.loadUserProfile();
    }
  }

  editProject() {
    if (this.keycloakService.isLoggedIn()) {
      this.router.navigate(['/', 'projects']);
    } else {
      this.keycloakService.login({
        redirectUri: window.location.href + 'projects'
      });
    }
  }
}
