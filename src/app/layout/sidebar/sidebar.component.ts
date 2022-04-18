import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faChalkboardTeacher, faFile, faHome, faIndustry, faSuitcase } from '@fortawesome/free-solid-svg-icons';
import { FeatureService } from '@data/service/feature.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  homeIcon = faHome;
  projectsIcon = faFile;
  jobsIcon = faSuitcase;
  orgsIcon = faIndustry;
  lecturersIcon = faChalkboardTeacher;

  @Output()
  backClicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  constructor(private featureService: FeatureService) {}

  ngOnInit(): void {}

  isFeatureEnabled(featureName: string): boolean {
    return this.featureService.isFeatureEnabled(featureName);
  }
}
