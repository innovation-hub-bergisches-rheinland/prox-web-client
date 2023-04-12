import { Component, Input, OnInit } from '@angular/core';
import { Lecturer } from '@data/schema/lecturer.types';
import { Organization } from '@data/schema/organization.types';
import { Project } from '@data/schema/project.types';
import { RecommendationResult } from '@data/schema/recommendation.types';
import { RecommendationService } from '@data/service/recommendation.service';
import { faHatWizard, faMagic, faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '@shared/modules/notifications/notification.service';

type RecommendationType = 'project' | 'lecturer' | 'organization';

@Component({
  selector: 'app-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss']
})
export class RecommendationCardComponent implements OnInit {
  recommendationIcon = faMagicWandSparkles;

  @Input() seedTags: string[];

  @Input() types: RecommendationType[] = ['project', 'lecturer', 'organization'];

  lecturerRecommendations: RecommendationResult<Lecturer> = [];
  organizationRecommendations: RecommendationResult<Organization> = [];
  projectRecommendations: RecommendationResult<Project> = [];

  get hasRecommendations(): boolean {
    return (
      (this.lecturerRecommendations.length > 0 && this.types.includes('lecturer')) ||
      (this.organizationRecommendations.length > 0 && this.types.includes('organization')) ||
      (this.projectRecommendations.length > 0 && this.types.includes('project'))
    );
  }

  constructor(private recommendationService: RecommendationService, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.recommendationService.getRecommendations(this.seedTags).subscribe({
      next: res => {
        this.lecturerRecommendations = res.lecturers;
        this.organizationRecommendations = res.organizations;
        this.projectRecommendations = res.projects;
      },
      error: err => {
        console.error(err);
        this.notificationService.error('Fehler beim Laden der Empfehlungen');
      }
    });
  }
}
