import { Component, Input, OnInit } from '@angular/core';
import { KeyCloakUser } from '@prox/keycloak/KeyCloakUser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  title: string;

  hasPermission = false;

  constructor(private user: KeyCloakUser) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
    });
  }

  ngOnInit() {}
}
