import { Component, OnInit } from '@angular/core';
import { KeyCloakUserService } from '@prox/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'prox-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private user: KeyCloakUserService, private router: Router) {}

  ngOnInit() {}

  editProject() {
    if (this.user.isLoggedIn()) {
      this.router.navigate(['/', 'projects']);
    } else {
      this.user.loginRedirect(window.location.href + 'projects');
    }
  }
}
