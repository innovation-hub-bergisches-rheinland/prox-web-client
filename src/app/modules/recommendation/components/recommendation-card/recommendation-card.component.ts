import { Component, Input, OnInit } from '@angular/core';
import { Lecturer } from '@data/schema/lecturer.types';
import { Organization } from '@data/schema/organization.types';
import { Project } from '@data/schema/project.types';
import { RecommendationResult } from '@data/schema/recommendation.types';
import { faMagicWandSparkles } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recommendation-card',
  templateUrl: './recommendation-card.component.html',
  styleUrls: ['./recommendation-card.component.scss']
})
export class RecommendationCardComponent {
  recommendationIcon = faMagicWandSparkles;

  @Input()
  lecturerRecommendations: RecommendationResult<Lecturer> = [];
  @Input()
  organizationRecommendations: RecommendationResult<Organization> = [];
  @Input()
  projectRecommendations: RecommendationResult<Project> = [];

  get hasRecommendations(): boolean {
    return this.lecturerRecommendations.length > 0 || this.organizationRecommendations.length > 0 || this.projectRecommendations.length > 0;
  }
}
