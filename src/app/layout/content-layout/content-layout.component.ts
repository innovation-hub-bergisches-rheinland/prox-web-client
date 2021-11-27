import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  @HostBinding()
  classes: string = 'content-layout';

  @Input()
  title: string;

  hasPermission: boolean;

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.hasPermission = this.keycloakService.isUserInRole('professor');
    } else {
      this.hasPermission = false;
    }
  }
}
