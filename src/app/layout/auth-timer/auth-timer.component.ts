import { Component, OnInit, OnDestroy } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-auth-timer',
  templateUrl: './auth-timer.component.html',
  styleUrls: ['./auth-timer.component.scss']
})
export class AuthTimerComponent implements OnInit, OnDestroy {
  constructor(private kcs: KeycloakService) {}

  subscription: Subscription;
  subscription2: Subscription;

  tokenEOL: number;
  logoutTimer: number;
  loggedIn = false;

  ngOnInit() {
    this.updateState();

    const source = interval(1000);
    this.subscription = source.subscribe(() => {
      this.logoutTimer = this.getTimeLeft();
    });

    const source2 = interval(10000);
    this.subscription = source2.subscribe(() => {
      this.updateState();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  getTimeLeft(): number {
    const end = new Date(this.tokenEOL * 1000).getTime();
    const atm = new Date(Date.now()).getTime();
    const res = Math.floor((end - atm) / 1000);
    return res;
  }

  updateState() {
    this.kcs.isLoggedIn().then(status => {
      this.loggedIn = status;
    });
    const kci = this.kcs.getKeycloakInstance();
    if (kci && kci.refreshTokenParsed) {
      this.tokenEOL = kci.refreshTokenParsed.exp;
    }
  }
}
