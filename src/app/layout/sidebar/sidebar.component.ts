import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faChalkboardTeacher, faFile, faHome, faIndustry, faQuestion } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  homeIcon = faHome;
  projectsIcon = faFile;
  orgsIcon = faIndustry;
  lecturersIcon = faChalkboardTeacher;
  faqIcon = faQuestion;

  @Output()
  backClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  @Output()
  navigationItemClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor() {}

  ngOnInit(): void {}
}
