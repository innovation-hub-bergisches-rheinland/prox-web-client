import { Lecturer } from './lecturer.types';
import { Organization } from './organization.types';
import { Project } from './project.types';

type RecommendationEntry<T> = {
  confidenceScore: number;
  item: T;
};

export type RecommendationResult<T> = RecommendationEntry<T>[];

export type RecommendationResponse = {
  lecturers: RecommendationResult<Lecturer>;
  organizations: RecommendationResult<Organization>;
  projects: RecommendationResult<Project>;
};
