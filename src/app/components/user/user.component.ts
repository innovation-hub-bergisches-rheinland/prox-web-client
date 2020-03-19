import { Component, OnInit } from '@angular/core';
import { KeyCloakUserService } from '@prox/core/services';

@Component({
  selector: 'prox-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username = '';
  isLoggedIn = false;

  constructor(protected user: KeyCloakUserService) {
    user.onUserChanged.subscribe(() => {
      this.onUserChanged();
    });
  }
  ngOnInit(): void {
    this.onUserChanged();
  }

  private onUserChanged() {
    this.isLoggedIn = this.user.isLoggedIn();

    if (this.isLoggedIn) {
      this.username = this.user.getFullName();
    } else {
      this.username = '';
    }
  }

  async login() {
    await this.user.login();
  }

  async logout() {
    await this.user.logout();
  }
}
