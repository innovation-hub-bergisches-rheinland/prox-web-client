import { Project } from '@prox/shared/hal-resources';

export class RelevantProject {
  relevance: number;
  project: Project;

  constructor(project: Project) {
    this.project = project;
    this.relevance = 0;
  }
}
