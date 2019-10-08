import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-auth-timer',
  templateUrl: './auth-timer.component.html',
  styleUrls: ['./auth-timer.component.scss']
})
export class AuthTimerComponent implements OnInit {
  constructor(private kcs: KeycloakService) {}

  subscription: Subscription;

  tokenEOL;
  refreshTokenEOL;
  logoutTimer;

  ngOnInit() {
    this.kcs.getKeycloakInstance().onAuthSuccess = this.updateState;
    this.kcs.getKeycloakInstance().onAuthRefreshSuccess = this.updateState;
    this.kcs.getKeycloakInstance().onAuthLogout = this.updateState;

    this.updateState();

    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      this.logoutTimer = this.getTimeLeft();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTimeLeft(): number {
    var end = new Date(this.refreshTokenEOL * 1000).getTime();
    var atm = new Date(Date.now()).getTime();
    return Math.floor((end - atm) / 1000);
  }

  updateState() {
    this.tokenEOL = this.kcs.getKeycloakInstance().tokenParsed.exp;
    this.refreshTokenEOL = this.kcs.getKeycloakInstance().refreshTokenParsed.exp;
  }
}
