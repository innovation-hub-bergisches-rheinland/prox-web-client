import { Component, Input, OnInit } from '@angular/core';
import { KeyCloakUserService } from '@prox/core/services';

@Component({
  selector: 'prox-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input()
  title: string;

  hasPermission = false;

  constructor(private user: KeyCloakUserService) {
    this.user.Load().then(() => {
      this.hasPermission = user.hasRole('professor');
    });
  }

  ngOnInit() {}
}
