import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
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

  constructor(private keycloakService: KeycloakService, private userService: UserService) {}

  async ngOnInit() {
    this.keycloakService.isLoggedIn().then(res => {
      this.isLoggedIn = res;
      if (res) {
        this.userAvatar = this.userService.getUserAvatar(this.keycloakService.getKeycloakInstance().subject);
      }
    });
  }

  async login() {
    await this.keycloakService.login({ redirectUri: window.location.href });
  }

  async logout() {
    await this.keycloakService.logout();
  }
}
