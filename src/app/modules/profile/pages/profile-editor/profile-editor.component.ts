import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit {
  isLecturer = false;

  constructor(private keycloakService: KeycloakService) {}

  async ngOnInit() {
    this.isLecturer = this.keycloakService.isUserInRole('professor');
  }
}
