import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faChalkboardTeacher, faFile, faHome, faIndustry, faLightbulb, faQuestion, faTag, faTags } from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  homeIcon = faHome;
  projectsIcon = faFile;
  proposalsIcon = faLightbulb;
  orgsIcon = faIndustry;
  lecturersIcon = faChalkboardTeacher;
  faqIcon = faQuestion;

  isAdmin = false;
  tagIcon = faTags;

  @Output()
  backClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @Output()
  navigationItemClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.isAdmin = this.keycloakService.isUserInRole('admin');
  }
}
