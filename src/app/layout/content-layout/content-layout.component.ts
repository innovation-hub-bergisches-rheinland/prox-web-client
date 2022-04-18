import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';
import { FeatureService } from '@data/service/feature.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit {
  @HostBinding()
  classes = 'content-layout';

  @Input()
  title: string;

  hasPermission: boolean;

  constructor(private keycloakService: KeycloakService, private featureService: FeatureService) {}

  async ngOnInit() {
    if (await this.keycloakService.isLoggedIn()) {
      this.hasPermission = this.keycloakService.isUserInRole('professor');
    } else {
      this.hasPermission = false;
    }
  }
}
